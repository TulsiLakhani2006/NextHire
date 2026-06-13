package com.backend.dto;

import com.backend.model.ApplicationStatus;
import lombok.*;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ApplicationResponse {
    private String id;
    private String jobId;
    private String candidateId;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
    private String coverLetter;
    private String recruiterNotes;
    private String resumeUrl;

    // enriched from Job
    private String jobTitle;
    private String company;

    // enriched from Profile + User
    private String candidateName;
    private String candidateEmail;
}