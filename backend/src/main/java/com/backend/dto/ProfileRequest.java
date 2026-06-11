package com.backend.dto;

import java.util.List;

import com.backend.model.Profile;

public class ProfileRequest {
    private String headline;
    private String bio;
    private List<String> skills;
    private List<Profile.Education> education;
    private List<Profile.Experience> experience;
    private String preferredLocation;
    private Double salaryExpectation;
    private boolean isPublic;

    // Getters & Setters
    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    public List<Profile.Education> getEducation() { return education; }
    public void setEducation(List<Profile.Education> education) { this.education = education; }
    public List<Profile.Experience> getExperience() { return experience; }
    public void setExperience(List<Profile.Experience> experience) { this.experience = experience; }
    public String getPreferredLocation() { return preferredLocation; }
    public void setPreferredLocation(String preferredLocation) { this.preferredLocation = preferredLocation; }
    public Double getSalaryExpectation() { return salaryExpectation; }
    public void setSalaryExpectation(Double salaryExpectation) { this.salaryExpectation = salaryExpectation; }
    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean aPublic) { isPublic = aPublic; }
}