package com.backend.dto;

import com.backend.model.JobStatus;
import com.backend.model.JobType;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class JobResponse {
    private String id;
    private String title;
    private String description;
    private List<String> requiredSkills;
    private int    minExperience;
    private int    maxExperience;
    private String location;
    private double salaryMin;
    private double salaryMax;
    private JobType   jobType;
    private JobStatus status;
    private String postedBy;
    private String recruiterName;
    private String companyName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}