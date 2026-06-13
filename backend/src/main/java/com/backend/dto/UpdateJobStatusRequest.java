package com.backend.dto;

import com.backend.model.JobStatus;

public class UpdateJobStatusRequest {
    private JobStatus status;

    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }
}