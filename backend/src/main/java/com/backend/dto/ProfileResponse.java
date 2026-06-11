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
    private String resumeUrl;
    private boolean isPublic;
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
        r.resumeUrl = p.getResumeUrl();
        r.isPublic = p.isPublic();
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
    public String getResumeUrl() { return resumeUrl; }
    public boolean isPublic() { return isPublic; }
    public int getCompletionPercent() { return completionPercent; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}