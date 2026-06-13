package com.backend.controller;

import com.backend.dto.ApplicationRequest;
import com.backend.dto.ApplicationResponse;
import com.backend.dto.ApplicationStatusUpdateRequest;
import com.backend.repository.UserRepository;
import com.backend.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final UserRepository     userRepository;

    /**
     * authentication.getName() returns EMAIL (set by UserDetailsServiceImpl).
     * Service methods need MongoDB document ID — resolve here.
     */
    private String getUserId(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"))
                .getId();
    }

    /* POST /api/applications — candidate applies */
    @PostMapping
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApplicationResponse> applyToJob(
            @RequestBody ApplicationRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(applicationService.applyToJob(getUserId(authentication), request));
    }

    /* GET /api/applications/me — candidate's own applications */
    @GetMapping("/me")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(
            Authentication authentication) {
        return ResponseEntity.ok(
                applicationService.getMyApplications(getUserId(authentication)));
    }

    /* GET /api/applications/check/{jobId} — has candidate already applied? */
    @GetMapping("/check/{jobId}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<Boolean> checkApplied(
            @PathVariable String jobId,
            Authentication authentication) {
        return ResponseEntity.ok(
                applicationService.hasApplied(getUserId(authentication), jobId));
    }

    /* GET /api/applications/jobs/{jobId} — recruiter views applicants */
    @GetMapping("/jobs/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Page<ApplicationResponse>> getApplicantsForJob(
            @PathVariable String jobId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        return ResponseEntity.ok(
                applicationService.getApplicantsForJob(jobId, getUserId(authentication), pageable));
    }

    /* PATCH /api/applications/{id} — recruiter updates status / adds note */
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable String id,
            @RequestBody ApplicationStatusUpdateRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(
                applicationService.updateApplicationStatus(id, getUserId(authentication), request));
    }

    /* DELETE /api/applications/{id} — candidate withdraws */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApplicationResponse> withdraw(
            @PathVariable String id,
            Authentication authentication) {
        return ResponseEntity.ok(
                applicationService.withdrawApplication(id, getUserId(authentication)));
    }
    @GetMapping("/recruiter/count")
@PreAuthorize("hasRole('RECRUITER')")
public ResponseEntity<Long> getTotalApplicantsForRecruiter(Authentication authentication) {
    return ResponseEntity.ok(applicationService.countApplicantsForRecruiter(getUserId(authentication)));
}
}