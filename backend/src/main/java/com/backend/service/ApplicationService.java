package com.backend.service;

import com.backend.dto.ApplicationRequest;
import com.backend.dto.ApplicationResponse;
import com.backend.dto.ApplicationStatusUpdateRequest;
import com.backend.model.*;
import com.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository         jobRepository;
    private final ProfileRepository     profileRepository;
    private final UserRepository        userRepository;

    /* ── Apply ── */
    public ApplicationResponse applyToJob(String candidateId, ApplicationRequest request) {
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));

        applicationRepository.findByCandidateIdAndJobId(candidateId, request.getJobId())
                .ifPresent(a -> { throw new ResponseStatusException(
                        HttpStatus.CONFLICT, "You have already applied to this job"); });

        Profile profile = profileRepository.findByUserId(candidateId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Please complete your profile before applying"));

        if (profile.getResumeUrl() == null || profile.getResumeUrl().isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Please upload a resume before applying");

        Application app = new Application(
                candidateId, request.getJobId(),
                profile.getResumeUrl(), request.getCoverLetter());

        return mapToResponse(applicationRepository.save(app), job, null, null);
    }

    /* ── Check if already applied ── */
    public boolean hasApplied(String candidateId, String jobId) {
        return applicationRepository.findByCandidateIdAndJobId(candidateId, jobId).isPresent();
    }

    /* ── Candidate: my applications ── */
    public List<ApplicationResponse> getMyApplications(String candidateId) {
        return applicationRepository
                .findByCandidateIdOrderByAppliedAtDesc(candidateId)
                .stream()
                .map(app -> {
                    Job job = jobRepository.findById(app.getJobId()).orElse(null);
                    return mapToResponse(app, job, null, null);
                }).toList();
    }

    /* ── Recruiter: applicants for a job ── */
    public Page<ApplicationResponse> getApplicantsForJob(
            String jobId, String recruiterId, Pageable pageable) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));

       if (!recruiterId.equals(job.getPostedBy()))
    throw new ResponseStatusException(HttpStatus.FORBIDDEN,
            "Not authorised to view applicants for this job");

       return applicationRepository.findByJobIdAndStatusNot(jobId, ApplicationStatus.WITHDRAWN, pageable).map(app -> {
    Profile profile = profileRepository.findByUserId(app.getCandidateId()).orElse(null);
    User    user    = userRepository.findById(app.getCandidateId()).orElse(null);
    return mapToResponse(app, job, profile, user);
});
    }

    /* ── Recruiter: update status / notes ── */
    public ApplicationResponse updateApplicationStatus(
            String applicationId, String recruiterId,
            ApplicationStatusUpdateRequest request) {

        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Application not found"));

        Job job = jobRepository.findById(app.getJobId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Job not found"));

        if (!job.getPostedBy().equals(recruiterId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Not authorised to update this application");

        if (request.getStatus() != null)
            app.setStatus(request.getStatus());
        if (request.getRecruiterNotes() != null)
            app.setRecruiterNotes(request.getRecruiterNotes());

        return mapToResponse(applicationRepository.save(app), job, null, null);
    }

    /* ── Candidate: withdraw ── */
    public ApplicationResponse withdrawApplication(String applicationId, String candidateId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Application not found"));

        if (!app.getCandidateId().equals(candidateId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Not authorised to withdraw this application");

        if (app.getStatus() == ApplicationStatus.ACCEPTED
                || app.getStatus() == ApplicationStatus.REJECTED)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot withdraw — application already " + app.getStatus());

        app.setStatus(ApplicationStatus.WITHDRAWN);
        Job job = jobRepository.findById(app.getJobId()).orElse(null);
        return mapToResponse(applicationRepository.save(app), job, null, null);
    }

    /* ── Mapper ── */
    private ApplicationResponse mapToResponse(
            Application app, Job job, Profile profile, User user) {
        ApplicationResponse res = new ApplicationResponse();
        res.setId(app.getId());
        res.setJobId(app.getJobId());
        res.setCandidateId(app.getCandidateId());
        res.setStatus(app.getStatus());
        res.setAppliedAt(app.getAppliedAt());
        res.setCoverLetter(app.getCoverLetter());
        res.setRecruiterNotes(app.getRecruiterNotes());
        res.setResumeUrl(app.getResumeSnapshot());
        if (job     != null) { res.setJobTitle(job.getTitle()); res.setCompany(job.getCompanyName()); }
    if (user != null) { res.setCandidateEmail(user.getEmail()); res.setCandidateName(user.getName()); }
        
        return res;
    }
    public long countApplicantsForRecruiter(String recruiterId) {
    List<Job> jobs = jobRepository.findByPostedBy(recruiterId);
    return jobs.stream()
            .mapToLong(j -> applicationRepository.countByJobIdAndStatusNot(j.getId(), ApplicationStatus.WITHDRAWN))
            .sum();
}
}