package com.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.AdminJobResponse;
import com.backend.dto.AdminStatsResponse;
import com.backend.dto.AdminUserResponse;
import com.backend.dto.UpdateJobStatusRequest;
import com.backend.dto.UpdateUserStatusRequest;
import com.backend.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/stats")
    public AdminStatsResponse getStats() {
        return adminService.getStats();
    }

    // ---- Users ----

    @GetMapping("/users")
    public List<AdminUserResponse> getAllUsers() {
        return adminService.getAllUsers();
    }

    @PatchMapping("/users/{id}/status")
    public Map<String, String> updateUserStatus(@PathVariable String id,
                                                  @RequestBody UpdateUserStatusRequest request) {
        adminService.updateUserStatus(id, request.isActive());
        return Map.of("status", "ok");
    }

    @DeleteMapping("/users/{id}")
    public Map<String, String> deleteUser(@PathVariable String id) {
        adminService.deleteUser(id);
        return Map.of("status", "deleted");
    }

    // ---- Jobs ----

    @GetMapping("/jobs")
    public List<AdminJobResponse> getAllJobs() {
        return adminService.getAllJobs();
    }

    @PatchMapping("/jobs/{id}/status")
    public Map<String, String> updateJobStatus(@PathVariable String id,
                                                 @RequestBody UpdateJobStatusRequest request) {
        adminService.updateJobStatus(id, request.getStatus());
        return Map.of("status", "ok");
    }

    @DeleteMapping("/jobs/{id}")
    public Map<String, String> deleteJob(@PathVariable String id) {
        adminService.deleteJob(id);
        return Map.of("status", "deleted");
    }
}