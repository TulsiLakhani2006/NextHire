package com.backend.dto;

import com.backend.model.JobType;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class JobRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotEmpty(message = "At least one skill is required")
    private List<String> requiredSkills;

    @Min(0) private int minExperience;
    @Min(0) private int maxExperience;

    @NotBlank(message = "Location is required")
    private String location;

    private double salaryMin;
    private double salaryMax;

    @NotNull(message = "Job type is required")
    private JobType jobType;

    private String companyName;
}