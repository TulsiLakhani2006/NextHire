package com.backend.service;

import com.backend.dto.ProfileRequest;
import com.backend.dto.ProfileResponse;
import com.backend.model.Profile;
import com.backend.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

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
        profile.setExperience(filterExperienceEntries(request.getExperience()));
        profile.setPreferredLocation(request.getPreferredLocation());
        profile.setSalaryExpectation(request.getSalaryExpectation());
        profile.setJobRole(request.getJobRole());
        profile.setExperienceYears(request.getExperienceYears());
        profile.setUpdatedAt(LocalDateTime.now());
        profile.setCompletionPercent(calculateCompletion(profile));

        Profile saved = profileRepository.save(profile);
        return ProfileResponse.from(saved);
    }

    // ---- Get profile by userId ----
   public ProfileResponse getProfileByUserId(String userId) {
    Profile profile = profileRepository.findByUserId(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
    return ProfileResponse.from(profile);
}

    // ---- Get all profiles (recruiters) ----
    public List<ProfileResponse> getPublicProfiles() {
        return profileRepository.findAll()
                .stream().map(ProfileResponse::from).toList();
    }

    // ---- Store resume URL (after upload) ----
    public ProfileResponse saveResumeUrl(String userId, String resumeUrl) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Profile p = new Profile();
                    p.setUserId(userId);
                    p.setCreatedAt(LocalDateTime.now());
                    return p;
                });

        profile.setResumeUrl(resumeUrl);
        profile.setUpdatedAt(LocalDateTime.now());
        profile.setCompletionPercent(calculateCompletion(profile));

        Profile saved = profileRepository.save(profile);
        return ProfileResponse.from(saved);
    }

    // ---- Calculate profile completion % ----
    private int calculateCompletion(Profile p) {
        int score = 0;
        if (p.getHeadline() != null && !p.getHeadline().isBlank())
            score += 20;
        if (p.getSkills() != null && !p.getSkills().isEmpty())
            score += 20;
        if (p.getEducation() != null && !p.getEducation().isEmpty())
            score += 20;
        boolean hasExperienceData = (p.getExperience() != null && !p.getExperience().isEmpty())
                || (p.getExperienceYears() != null && p.getExperienceYears() > 0);
        if (hasExperienceData)
            score += 20;
        if (p.getResumeUrl() != null && !p.getResumeUrl().isBlank())
            score += 20;
        return score;
    }

    private List<Profile.Experience> filterExperienceEntries(List<Profile.Experience> entries) {
        if (entries == null) return null;
        return entries.stream()
                .filter(e -> e != null && (
                        (e.getCompany() != null && !e.getCompany().isBlank()) ||
                        (e.getTitle() != null && !e.getTitle().isBlank()) ||
                        (e.getLocation() != null && !e.getLocation().isBlank()) ||
                        (e.getStartDate() != null && !e.getStartDate().isBlank()) ||
                        (e.getEndDate() != null && !e.getEndDate().isBlank()) ||
                        e.isCurrent() ||
                        (e.getDescription() != null && !e.getDescription().isBlank())
                )).toList();
    }
}