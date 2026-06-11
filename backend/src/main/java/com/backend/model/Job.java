package com.backend.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "jobs")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Job {
    @Id
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
    private String postedBy;        // recruiterId
    private String recruiterName;
    private String companyName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}