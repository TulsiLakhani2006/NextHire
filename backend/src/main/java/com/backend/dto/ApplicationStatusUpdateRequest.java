package com.backend.dto;

import com.backend.model.ApplicationStatus;
import lombok.Data;

@Data
public class ApplicationStatusUpdateRequest {
    private ApplicationStatus status;       // nullable — only update if present
    private String recruiterNotes;          // nullable — only update if present
}