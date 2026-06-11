package com.backend.service;

import com.backend.dto.ProfileRequest;
import com.backend.dto.ProfileResponse;
import com.backend.model.Profile;
import com.backend.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    // ---- Upsert profile (create or update) ----
    public ProfileResponse upsertProfile(String userId, ProfileRequest request) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElse(new Profile());

        if (profile.getId() == null) {
            profile.setUserId(userId);
            profile.setCreatedAt(LocalDateTime.now());
        }

        profile.setHeadline(request.getHeadline());
        profile.setBio(request.getBio());
        profile.setSkills(request.getSkills());
        profile.setEducation(request.getEducation());
        profile.setExperience(request.getExperience());
        profile.setPreferredLocation(request.getPreferredLocation());
        profile.setSalaryExpectation(request.getSalaryExpectation());
        profile.setPublic(request.isPublic());
        profile.setUpdatedAt(LocalDateTime.now());
        profile.setCompletionPercent(calculateCompletion(profile));

        Profile saved = profileRepository.save(profile);
        return ProfileResponse.from(saved);
    }

    // ---- Get profile by userId ----
    public ProfileResponse getProfileByUserId(String userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return ProfileResponse.from(profile);
    }

    // ---- Get all public profiles (for recruiters) ----
    public List<ProfileResponse> getPublicProfiles() {
        return profileRepository.findByIsPublicTrue()
                .stream().map(ProfileResponse::from).toList();
    }

    // ---- Toggle visibility ----
    public ProfileResponse toggleVisibility(String userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        profile.setPublic(!profile.isPublic());
        profile.setUpdatedAt(LocalDateTime.now());
        return ProfileResponse.from(profileRepository.save(profile));
    }

    // ---- Store resume URL (after upload) ----
    public ProfileResponse saveResumeUrl(String userId, String resumeUrl) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        profile.setResumeUrl(resumeUrl);
        profile.setUpdatedAt(LocalDateTime.now());
        profile.setCompletionPercent(calculateCompletion(profile));
        return ProfileResponse.from(profileRepository.save(profile));
    }

    // ---- Calculate profile completion % ----
    private int calculateCompletion(Profile p) {
        int score = 0;
        if (p.getHeadline() != null && !p.getHeadline().isBlank()) score += 20;
        if (p.getSkills() != null && !p.getSkills().isEmpty()) score += 20;
        if (p.getEducation() != null && !p.getEducation().isEmpty()) score += 20;
        if (p.getExperience() != null && !p.getExperience().isEmpty()) score += 20;
        if (p.getResumeUrl() != null && !p.getResumeUrl().isBlank()) score += 20;
        return score;
    }
}