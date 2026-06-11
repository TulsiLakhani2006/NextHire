package com.backend.controller;

import com.backend.dto.ProfileRequest;
import com.backend.dto.ProfileResponse;
import com.backend.security.JwtUtil;
import com.backend.service.ProfileService;
import com.backend.service.ResumeStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired private ProfileService profileService;
    @Autowired private ResumeStorageService resumeStorageService;
    @Autowired private JwtUtil jwtUtil;

    // Helper: extract userId from Bearer token
    private String extractUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUsername(token); // returns email/userId
    }

    // ---- PUT /api/profile  — create or update own profile ----
    @PutMapping
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ProfileResponse> upsertProfile(
            @RequestHeader("Authorization") String auth,
            @RequestBody ProfileRequest request) {
        String userId = extractUserId(auth);
        return ResponseEntity.ok(profileService.upsertProfile(userId, request));
    }

    // ---- GET /api/profile/me  — get own profile ----
    @GetMapping("/me")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ProfileResponse> getMyProfile(
            @RequestHeader("Authorization") String auth) {
        String userId = extractUserId(auth);
        return ResponseEntity.ok(profileService.getProfileByUserId(userId));
    }

    // ---- GET /api/profile/public  — all public profiles (recruiters) ----
    @GetMapping("/public")
    @PreAuthorize("hasAnyRole('RECRUITER','ADMIN')")
    public ResponseEntity<List<ProfileResponse>> getPublicProfiles() {
        return ResponseEntity.ok(profileService.getPublicProfiles());
    }

    // ---- PATCH /api/profile/visibility  — toggle public/private ----
    @PatchMapping("/visibility")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ProfileResponse> toggleVisibility(
            @RequestHeader("Authorization") String auth) {
        String userId = extractUserId(auth);
        return ResponseEntity.ok(profileService.toggleVisibility(userId));
    }

    // ---- POST /api/profile/resume  — upload PDF ----
    @PostMapping("/resume")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ProfileResponse> uploadResume(
            @RequestHeader("Authorization") String auth,
            @RequestParam("file") MultipartFile file) throws IOException {
        String userId = extractUserId(auth);
        String resumeUrl = resumeStorageService.store(file);
        return ResponseEntity.ok(profileService.saveResumeUrl(userId, resumeUrl));
    }
}