package com.backend.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "profiles")
public class Profile {

    @Id
    private String id;

    private String userId;           // linked to User._id
    private String headline;
    private String bio;
    private List<String> skills;
    private List<Education> education;
    private List<Experience> experience;
    private String preferredLocation;
    private Double salaryExpectation;
    private String jobRole;
    private Integer experienceYears;
    private String resumeUrl;        // S3 or GridFS URL
    private int completionPercent;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // ---- nested Education ----
    public static class Education {
        private String institution;
        private String degree;
        private String fieldOfStudy;
        private String startYear;
        private String endYear;
        // getters & setters
        public String getInstitution() { return institution; }
        public void setInstitution(String institution) { this.institution = institution; }
        public String getDegree() { return degree; }
        public void setDegree(String degree) { this.degree = degree; }
        public String getFieldOfStudy() { return fieldOfStudy; }
        public void setFieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; }
        public String getStartYear() { return startYear; }
        public void setStartYear(String startYear) { this.startYear = startYear; }
        public String getEndYear() { return endYear; }
        public void setEndYear(String endYear) { this.endYear = endYear; }
    }

    // ---- nested Experience ----
    public static class Experience {
        private String company;
        private String title;
        private String location;
        private String startDate;
        private String endDate;
        private boolean current;
        private String description;
        // getters & setters
        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public String getStartDate() { return startDate; }
        public void setStartDate(String startDate) { this.startDate = startDate; }
        public String getEndDate() { return endDate; }
        public void setEndDate(String endDate) { this.endDate = endDate; }
        public boolean isCurrent() { return current; }
        public void setCurrent(boolean current) { this.current = current; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    // ---- Getters & Setters ----
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    public List<Education> getEducation() { return education; }
    public void setEducation(List<Education> education) { this.education = education; }
    public List<Experience> getExperience() { return experience; }
    public void setExperience(List<Experience> experience) { this.experience = experience; }
    public String getPreferredLocation() { return preferredLocation; }
    public void setPreferredLocation(String preferredLocation) { this.preferredLocation = preferredLocation; }
    public Double getSalaryExpectation() { return salaryExpectation; }
    public void setSalaryExpectation(Double salaryExpectation) { this.salaryExpectation = salaryExpectation; }
    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }
    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }
    public int getCompletionPercent() { return completionPercent; }
    public void setCompletionPercent(int completionPercent) { this.completionPercent = completionPercent; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}