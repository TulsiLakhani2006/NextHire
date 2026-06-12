package com.backend.dto;

import com.backend.model.ApplicationStatus;

public class ApplicationStatusUpdateRequest {
    private ApplicationStatus status;
    private String recruiterNotes;

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public String getRecruiterNotes() { return recruiterNotes; }
    public void setRecruiterNotes(String recruiterNotes) { this.recruiterNotes = recruiterNotes; }
}