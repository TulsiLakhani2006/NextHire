package com.backend.dto;

import java.time.LocalDateTime;

import com.backend.model.JobStatus;
import com.backend.model.JobType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminJobResponse {
    private String id;
    private String title;
    private String companyName;
    private String recruiterName;
    private String postedBy;
    private JobType jobType;
    private JobStatus status;
    private LocalDateTime createdAt;
}