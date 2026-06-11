package com.backend.controller;

import com.backend.dto.JobRequest;
import com.backend.dto.JobResponse;
import com.backend.model.User;
import com.backend.repository.UserRepository;
import com.backend.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    private final UserRepository userRepository;

    private User currentUser(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername()).orElseThrow();
    }

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<JobResponse> create(
            @Valid @RequestBody JobRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(jobService.createJob(req, currentUser(ud).getId()));
    }

    @GetMapping
    public ResponseEntity<Page<JobResponse>> getAll(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false)    String search) {
        return ResponseEntity.ok(jobService.getAllActiveJobs(page, size, search));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<JobResponse>> getMyJobs(
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(jobService.getMyJobs(currentUser(ud).getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getOne(@PathVariable String id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<JobResponse> update(
            @PathVariable String id,
            @Valid @RequestBody JobRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(jobService.updateJob(id, req, currentUser(ud).getId()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Void> delete(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails ud) {
        jobService.deleteJob(id, currentUser(ud).getId());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/close")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<JobResponse> close(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(jobService.closeJob(id, currentUser(ud).getId()));
    }
}