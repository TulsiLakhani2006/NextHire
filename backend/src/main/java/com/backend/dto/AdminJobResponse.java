package com.backend.dto;

import java.time.LocalDateTime;

import com.backend.model.JobStatus;
import com.backend.model.JobType;

public class AdminJobResponse {

    private String id;
    private String title;
    private String companyName;
    private String recruiterName;
    private String postedBy;
    private JobType jobType;
    private JobStatus status;
    private LocalDateTime createdAt;

    public AdminJobResponse() {}

    public AdminJobResponse(String id, String title, String companyName, String recruiterName,
                             String postedBy, JobType jobType, JobStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.companyName = companyName;
        this.recruiterName = recruiterName;
        this.postedBy = postedBy;
        this.jobType = jobType;
        this.status = status;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getRecruiterName() { return recruiterName; }
    public void setRecruiterName(String recruiterName) { this.recruiterName = recruiterName; }

    public String getPostedBy() { return postedBy; }
    public void setPostedBy(String postedBy) { this.postedBy = postedBy; }

    public JobType getJobType() { return jobType; }
    public void setJobType(JobType jobType) { this.jobType = jobType; }

    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}