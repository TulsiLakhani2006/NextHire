package com.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.ApplicationRequest;
import com.backend.dto.ApplicationResponse;
import com.backend.dto.ApplicationStatusUpdateRequest;
import com.backend.service.ApplicationService;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    // POST /api/applications
    @PostMapping
    public ResponseEntity<ApplicationResponse> applyToJob(
            @RequestBody ApplicationRequest request,
            Authentication authentication) {

        String candidateId = authentication.getName();
        return ResponseEntity.ok(applicationService.applyToJob(candidateId, request));
    }

    // GET /api/applications/me
    @GetMapping("/me")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(Authentication authentication) {
        String candidateId = authentication.getName();
        return ResponseEntity.ok(applicationService.getMyApplications(candidateId));
    }

    // PATCH /api/applications/{id}
    @PatchMapping("/{id}")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable String id,
            @RequestBody ApplicationStatusUpdateRequest request,
            Authentication authentication) {

        String recruiterId = authentication.getName();
        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, recruiterId, request));
    }

    // DELETE /api/applications/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<ApplicationResponse> withdraw(
            @PathVariable String id,
            Authentication authentication) {

        String candidateId = authentication.getName();
        return ResponseEntity.ok(applicationService.withdrawApplication(id, candidateId));
    }
}