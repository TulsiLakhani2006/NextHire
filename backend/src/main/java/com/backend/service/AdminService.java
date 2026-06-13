package com.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.backend.dto.AdminJobResponse;
import com.backend.dto.AdminStatsResponse;
import com.backend.dto.AdminUserResponse;
import com.backend.model.Job;
import com.backend.model.JobStatus;
import com.backend.model.Role;
import com.backend.model.User;
import com.backend.repository.ApplicationRepository;
import com.backend.repository.JobRepository;
import com.backend.repository.UserRepository;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    // ---- Stats ----

    public AdminStatsResponse getStats() {
        long totalUsers = userRepository.count();
        long totalCandidates = userRepository.findByRole(Role.CANDIDATE).size();
        long totalRecruiters = userRepository.findByRole(Role.RECRUITER).size();
        long totalJobs = jobRepository.count();
        long activeJobs = jobRepository.countByStatus(JobStatus.ACTIVE);
        long closedJobs = totalJobs - activeJobs;
        long totalApplications = applicationRepository.count();

        return new AdminStatsResponse(
                totalUsers, totalCandidates, totalRecruiters,
                totalJobs, activeJobs, closedJobs, totalApplications
        );
    }

    // ---- Users ----

    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    public void updateUserStatus(String userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() == Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot modify admin accounts");
        }

        user.setActive(active);
        userRepository.save(user);
    }

    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() == Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot delete admin accounts");
        }

        userRepository.deleteById(userId);
    }

    // ---- Jobs ----

    public List<AdminJobResponse> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(this::toJobResponse)
                .collect(Collectors.toList());
    }

    public void updateJobStatus(String jobId, JobStatus status) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));

        job.setStatus(status);
        jobRepository.save(job);
    }

    public void deleteJob(String jobId) {
        if (!jobRepository.existsById(jobId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found");
        }
        jobRepository.deleteById(jobId);
    }

    // ---- Helpers ----

    private AdminUserResponse toUserResponse(User u) {
        boolean active = u.getActive() == null || u.getActive();
        return new AdminUserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole(), active);
    }

    private AdminJobResponse toJobResponse(Job j) {
        return new AdminJobResponse(
                j.getId(), j.getTitle(), j.getCompanyName(), j.getRecruiterName(),
                j.getPostedBy(), j.getJobType(), j.getStatus(), j.getCreatedAt()
        );
    }
}