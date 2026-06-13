package com.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.AnalyticsResponse;
import com.backend.service.AnalyticsService;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    /**
     * GET /api/analytics/recruiter
     * Returns analytics for the currently authenticated recruiter.
     * Recruiter ID is taken from the JWT-authenticated principal.
     */
    @GetMapping("/recruiter")
    public AnalyticsResponse getRecruiterAnalytics(Authentication authentication) {
        String recruiterId = authentication.getName(); // adjust if your UserDetails uses a different identifier (e.g. user ID vs email)
        return analyticsService.getRecruiterAnalytics(recruiterId);
    }
}