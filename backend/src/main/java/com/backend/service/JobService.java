package com.backend.service;

import com.backend.dto.JobRequest;
import com.backend.dto.JobResponse;
import com.backend.model.*;
import com.backend.repository.JobRepository;
import com.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    /* ── Create ── */
    public JobResponse createJob(JobRequest req, String recruiterId) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recruiter not found"));

        Job job = Job.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .requiredSkills(req.getRequiredSkills())
                .minExperience(req.getMinExperience())
                .maxExperience(req.getMaxExperience())
                .location(req.getLocation())
                .salaryMin(req.getSalaryMin())
                .salaryMax(req.getSalaryMax())
                .jobType(req.getJobType())
                .companyName(req.getCompanyName())
                .status(JobStatus.ACTIVE)
                .postedBy(recruiterId)
                .recruiterName(recruiter.getName())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return toResponse(jobRepository.save(job));
    }

    /* ── Read all (paginated) ── */
    public Page<JobResponse> getAllActiveJobs(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Job> jobs = (search != null && !search.isBlank())
                ? jobRepository.findByStatusAndTitleContainingIgnoreCase(JobStatus.ACTIVE, search, pageable)
                : jobRepository.findByStatus(JobStatus.ACTIVE, pageable);
        return jobs.map(this::toResponse);
    }

    /* ── Read one ── */
    public JobResponse getJobById(String id) {
        return toResponse(findOrThrow(id));
    }

    /* ── Recruiter's own jobs ── */
    public List<JobResponse> getMyJobs(String recruiterId) {
        return jobRepository.findByPostedByOrderByCreatedAtDesc(recruiterId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /* ── Update ── */
    public JobResponse updateJob(String id, JobRequest req, String recruiterId) {
        Job job = findOrThrow(id);
        checkOwner(job, recruiterId);

        job.setTitle(req.getTitle());
        job.setDescription(req.getDescription());
        job.setRequiredSkills(req.getRequiredSkills());
        job.setMinExperience(req.getMinExperience());
        job.setMaxExperience(req.getMaxExperience());
        job.setLocation(req.getLocation());
        job.setSalaryMin(req.getSalaryMin());
        job.setSalaryMax(req.getSalaryMax());
        job.setJobType(req.getJobType());
        job.setCompanyName(req.getCompanyName());
        job.setUpdatedAt(LocalDateTime.now());

        return toResponse(jobRepository.save(job));
    }

    /* ── Soft-delete (CLOSED) ── */
    public void deleteJob(String id, String recruiterId) {
        Job job = findOrThrow(id);
        checkOwner(job, recruiterId);
        job.setStatus(JobStatus.CLOSED);
        job.setUpdatedAt(LocalDateTime.now());
        jobRepository.save(job);
    }

    /* ── Close (keep visible but not accepting) ── */
    public JobResponse closeJob(String id, String recruiterId) {
        Job job = findOrThrow(id);
        checkOwner(job, recruiterId);
        job.setStatus(JobStatus.CLOSED);
        job.setUpdatedAt(LocalDateTime.now());
        return toResponse(jobRepository.save(job));
    }

    /* ── Helpers ── */
    private Job findOrThrow(String id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
    }

    private void checkOwner(Job job, String recruiterId) {
        if (!job.getPostedBy().equals(recruiterId))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorised to modify this job");
    }

    private JobResponse toResponse(Job j) {
        return JobResponse.builder()
                .id(j.getId()).title(j.getTitle()).description(j.getDescription())
                .requiredSkills(j.getRequiredSkills())
                .minExperience(j.getMinExperience()).maxExperience(j.getMaxExperience())
                .location(j.getLocation()).salaryMin(j.getSalaryMin()).salaryMax(j.getSalaryMax())
                .jobType(j.getJobType()).status(j.getStatus())
                .postedBy(j.getPostedBy()).recruiterName(j.getRecruiterName())
                .companyName(j.getCompanyName())
                .createdAt(j.getCreatedAt()).updatedAt(j.getUpdatedAt())
                .build();
    }
}