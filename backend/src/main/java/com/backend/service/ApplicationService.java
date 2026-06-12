package com.backend.service;

import com.backend.dto.ApplicationRequest;
import com.backend.dto.ApplicationResponse;
import com.backend.dto.ApplicationStatusUpdateRequest;
import com.backend.model.*;
import com.backend.repository.ApplicationRepository;
import com.backend.repository.JobRepository;
import com.backend.repository.ProfileRepository;
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    public ApplicationResponse applyToJob(String candidateId, ApplicationRequest request) {

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        applicationRepository.findByCandidateIdAndJobId(candidateId, request.getJobId())
                .ifPresent(a -> {
                    throw new RuntimeException("You have already applied to this job");
                });

        Profile profile = profileRepository.findByUserId(candidateId)
                .orElseThrow(() -> new RuntimeException("Profile not found. Please complete your profile first."));

        if (profile.getResumeUrl() == null || profile.getResumeUrl().isEmpty()) {
            throw new RuntimeException("Please upload a resume before applying");
        }

        Application application = new Application(
                candidateId,
                request.getJobId(),
                profile.getResumeUrl(),
                request.getCoverLetter()
        );

        Application saved = applicationRepository.save(application);
        return mapToResponse(saved, job, null, null);
    }

    public List<ApplicationResponse> getMyApplications(String candidateId) {
        List<Application> applications = applicationRepository.findByCandidateIdOrderByAppliedAtDesc(candidateId);

        return applications.stream().map(app -> {
            Job job = jobRepository.findById(app.getJobId()).orElse(null);
            return mapToResponse(app, job, null, null);
        }).toList();
    }

    public Page<ApplicationResponse> getApplicantsForJob(String jobId, String recruiterId, Pageable pageable) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getPostedBy().equals(recruiterId)) {
            throw new RuntimeException("You are not authorized to view applicants for this job");
        }

        Page<Application> applications = applicationRepository.findByJobId(jobId, pageable);

        return applications.map(app -> {
            Profile profile = profileRepository.findByUserId(app.getCandidateId()).orElse(null);
            User user = userRepository.findById(app.getCandidateId()).orElse(null);
            return mapToResponse(app, job, profile, user);
        });
    }

    public ApplicationResponse updateApplicationStatus(String applicationId, String recruiterId,
                                                         ApplicationStatusUpdateRequest request) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Job job = jobRepository.findById(application.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getPostedBy().equals(recruiterId)) {
            throw new RuntimeException("You are not authorized to update this application");
        }

        if (request.getStatus() != null) {
            application.setStatus(request.getStatus());
            // Phase 7: trigger notification to candidate here
        }

        if (request.getRecruiterNotes() != null) {
            application.setRecruiterNotes(request.getRecruiterNotes());
        }

        Application updated = applicationRepository.save(application);
        return mapToResponse(updated, job, null, null);
    }

    public ApplicationResponse withdrawApplication(String applicationId, String candidateId) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getCandidateId().equals(candidateId)) {
            throw new RuntimeException("You are not authorized to withdraw this application");
        }

        if (application.getStatus() == ApplicationStatus.ACCEPTED
                || application.getStatus() == ApplicationStatus.REJECTED) {
            throw new RuntimeException("Cannot withdraw an application that has already been " + application.getStatus());
        }

        application.setStatus(ApplicationStatus.WITHDRAWN);
        Application updated = applicationRepository.save(application);

        Job job = jobRepository.findById(application.getJobId()).orElse(null);
        return mapToResponse(updated, job, null, null);
    }

    private ApplicationResponse mapToResponse(Application app, Job job, Profile profile, User user) {
        ApplicationResponse res = new ApplicationResponse();
        res.setId(app.getId());
        res.setJobId(app.getJobId());
        res.setCandidateId(app.getCandidateId());
        res.setStatus(app.getStatus());
        res.setAppliedAt(app.getAppliedAt());
        res.setCoverLetter(app.getCoverLetter());
        res.setRecruiterNotes(app.getRecruiterNotes());
        res.setResumeUrl(app.getResumeSnapshot());

        if (job != null) {
            res.setJobTitle(job.getTitle());
            res.setCompany(job.getCompanyName());
        }
        if (profile != null) {
            res.setCandidateName(profile.getFullName());
        }
        if (user != null) {
            res.setCandidateEmail(user.getEmail());
        }

        return res;
    }
}