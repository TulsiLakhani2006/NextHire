package com.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.backend.model.Profile;

public class ProfileResponse {
    private String id;
    private String userId;
    private String headline;
    private String bio;
    private List<String> skills;
    private List<Profile.Education> education;
    private List<Profile.Experience> experience;
    private String preferredLocation;
    private Double salaryExpectation;
    private String jobRole;
    private Integer experienceYears;
    private String resumeUrl;
    private int completionPercent;
    private LocalDateTime updatedAt;

    // Static factory method
    public static ProfileResponse from(Profile p) {
        ProfileResponse r = new ProfileResponse();
        r.id = p.getId();
        r.userId = p.getUserId();
        r.headline = p.getHeadline();
        r.bio = p.getBio();
        r.skills = p.getSkills();
        r.education = p.getEducation();
        r.experience = p.getExperience();
        r.preferredLocation = p.getPreferredLocation();
        r.salaryExpectation = p.getSalaryExpectation();
        r.jobRole = p.getJobRole();
        r.experienceYears = p.getExperienceYears();
        r.resumeUrl = p.getResumeUrl();
        r.completionPercent = p.getCompletionPercent();
        r.updatedAt = p.getUpdatedAt();
        return r;
    }

    // Getters
    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getHeadline() { return headline; }
    public String getBio() { return bio; }
    public List<String> getSkills() { return skills; }
    public List<Profile.Education> getEducation() { return education; }
    public List<Profile.Experience> getExperience() { return experience; }
    public String getPreferredLocation() { return preferredLocation; }
    public Double getSalaryExpectation() { return salaryExpectation; }
    public String getJobRole() { return jobRole; }
    public Integer getExperienceYears() { return experienceYears; }
    public String getResumeUrl() { return resumeUrl; }
    public int getCompletionPercent() { return completionPercent; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}