package com.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.NotificationResponse;
import com.backend.dto.SendMessageRequest;
import com.backend.model.User;
import com.backend.repository.UserRepository;
import com.backend.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    private String resolveUserId(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @GetMapping
    public List<NotificationResponse> getMyNotifications(Authentication authentication) {
        return notificationService.getNotificationsForUser(resolveUserId(authentication));
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(Authentication authentication) {
        long count = notificationService.getUnreadCount(resolveUserId(authentication));
        return Map.of("count", count);
    }

    @PatchMapping("/{id}/read")
    public Map<String, String> markAsRead(@PathVariable String id, Authentication authentication) {
        notificationService.markAsRead(id, resolveUserId(authentication));
        return Map.of("status", "ok");
    }

    @PatchMapping("/read-all")
    public Map<String, String> markAllAsRead(Authentication authentication) {
        notificationService.markAllAsRead(resolveUserId(authentication));
        return Map.of("status", "ok");
    }

    /**
     * Recruiter sends a direct message/note to a candidate.
     */
    @PostMapping("/message")
    public Map<String, String> sendMessage(@RequestBody SendMessageRequest request) {
        notificationService.sendMessage(
                request.getCandidateId(),
                request.getTitle(),
                request.getMessage(),
                request.getRelatedJobId()
        );
        return Map.of("status", "sent");
    }
}