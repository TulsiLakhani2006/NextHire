package com.backend.service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.dto.AnalyticsResponse;
import com.backend.model.Application;
import com.backend.model.ApplicationStatus;
import com.backend.model.Job;
import com.backend.model.JobStatus;
import com.backend.model.User;
import com.backend.repository.ApplicationRepository;
import com.backend.repository.JobRepository;
import com.backend.repository.UserRepository;

@Service
public class AnalyticsService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * @param email recruiter's email (from JWT principal)
     */
   // @Cacheable(value = "recruiterAnalytics", key = "#email")
    public AnalyticsResponse getRecruiterAnalytics(String email) {

        // Resolve email -> user ID, since Job.postedBy stores the recruiter's ID
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
        String recruiterId = user.getId();

        List<Job> jobs = jobRepository.findByPostedBy(recruiterId);
        List<String> jobIds = jobs.stream().map(Job::getId).collect(Collectors.toList());

        List<Application> applications = jobIds.isEmpty()
                ? Collections.emptyList()
                : applicationRepository.findByJobIdIn(jobIds);

        AnalyticsResponse response = new AnalyticsResponse();

        long activeJobs = jobs.stream()
                .filter(j -> j.getStatus() == JobStatus.ACTIVE)
                .count();

        response.setTotalJobs(jobs.size());
        response.setActiveJobs(activeJobs);
        response.setTotalApplicants(applications.size());

        long hired = applications.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.ACCEPTED)
                .count();
        response.setTotalHired(hired);

        Map<String, Long> statusCounts = new LinkedHashMap<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            statusCounts.put(status.name(), 0L);
        }
        for (Application app : applications) {
            String key = app.getStatus().name();
            statusCounts.put(key, statusCounts.getOrDefault(key, 0L) + 1);
        }
        response.setApplicationsByStatus(statusCounts);

        Map<String, Long> typeCounts = jobs.stream()
                .collect(Collectors.groupingBy(
                        j -> j.getJobType() != null ? j.getJobType().name() : "UNSPECIFIED",
                        LinkedHashMap::new,
                        Collectors.counting()
                ));
        response.setJobsByType(typeCounts);

        Map<String, Long> dailyMap = new LinkedHashMap<>();
        LocalDate today = LocalDate.now(ZoneId.systemDefault());
        for (int i = 29; i >= 0; i--) {
            dailyMap.put(today.minusDays(i).format(DATE_FMT), 0L);
        }
        for (Application app : applications) {
            if (app.getAppliedAt() == null) continue;
            LocalDate appliedDate = app.getAppliedAt()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
            String key = appliedDate.format(DATE_FMT);
            if (dailyMap.containsKey(key)) {
                dailyMap.put(key, dailyMap.get(key) + 1);
            }
        }
        List<AnalyticsResponse.DailyCount> dailyCounts = dailyMap.entrySet().stream()
                .map(e -> new AnalyticsResponse.DailyCount(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
        response.setApplicationsOverTime(dailyCounts);

        Map<String, Long> applicantsPerJob = applications.stream()
                .collect(Collectors.groupingBy(Application::getJobId, Collectors.counting()));

        List<AnalyticsResponse.JobApplicantCount> topJobs = jobs.stream()
                .map(j -> new AnalyticsResponse.JobApplicantCount(
                        j.getId(),
                        j.getTitle(),
                        applicantsPerJob.getOrDefault(j.getId(), 0L)
                ))
                .sorted((a, b) -> Long.compare(b.getApplicantCount(), a.getApplicantCount()))
                .limit(5)
                .collect(Collectors.toList());
        response.setTopJobsByApplicants(topJobs);

        return response;
    }
}