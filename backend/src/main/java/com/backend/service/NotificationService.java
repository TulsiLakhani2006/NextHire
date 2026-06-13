package com.backend.service;

import com.backend.dto.NotificationResponse;
import com.backend.model.*;
import com.backend.repository.NotificationRepository;
import com.backend.repository.ProfileRepository;
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    // ---- Fetch ----

    public List<NotificationResponse> getNotificationsForUser(String userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByRecipientIdAndReadFalse(userId);
    }

    public void markAsRead(String notificationId, String userId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!n.getRecipientId().equals(userId)) {
            throw new RuntimeException("Not authorized to modify this notification");
        }

        n.setRead(true);
        notificationRepository.save(n);
    }

    public void markAllAsRead(String userId) {
        List<Notification> notifications = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
        for (Notification n : notifications) {
            if (!n.isRead()) {
                n.setRead(true);
            }
        }
        notificationRepository.saveAll(notifications);
    }

    // ---- Create (called from other services) ----

    /**
     * Call this when a recruiter changes an application's status.
     */
    public void notifyStatusChange(String candidateId, String jobTitle, String applicationId,
                                    String jobId, ApplicationStatus newStatus) {
        String title = "Application Update";
        String message = "Your application for \"" + jobTitle + "\" is now: " + formatStatus(newStatus);

        Notification n = Notification.builder()
                .recipientId(candidateId)
                .type(NotificationType.STATUS_CHANGE)
                .title(title)
                .message(message)
                .relatedJobId(jobId)
                .relatedApplicationId(applicationId)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(n);
    }

    /**
     * Call this when a recruiter posts a new job.
     * Notifies all candidates whose profile skills overlap with job.requiredSkills.
     */
    public void notifyMatchingCandidates(Job job) {
        if (job.getRequiredSkills() == null || job.getRequiredSkills().isEmpty()) {
            return;
        }

        List<User> candidates = userRepository.findByRole(Role.CANDIDATE);

        for (User candidate : candidates) {
            Profile profile = profileRepository.findByUserId(candidate.getId()).orElse(null);
            if (profile == null || profile.getSkills() == null) continue;

            boolean hasMatch = profile.getSkills().stream()
                    .anyMatch(skill -> job.getRequiredSkills().stream()
                            .anyMatch(req -> req.equalsIgnoreCase(skill)));

            if (hasMatch) {
                Notification n = Notification.builder()
                        .recipientId(candidate.getId())
                        .type(NotificationType.NEW_MATCHING_JOB)
                        .title("New Job Match")
                        .message("A new job \"" + job.getTitle() + "\" at " + job.getCompanyName()
                                + " matches your skills.")
                        .relatedJobId(job.getId())
                        .read(false)
                        .createdAt(LocalDateTime.now())
                        .build();

                notificationRepository.save(n);
            }
        }
    }

    /**
     * Call this when a recruiter sends a direct message to a candidate.
     */
    public void sendMessage(String candidateId, String title, String message, String relatedJobId) {
        Notification n = Notification.builder()
                .recipientId(candidateId)
                .type(NotificationType.MESSAGE)
                .title(title)
                .message(message)
                .relatedJobId(relatedJobId)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(n);
    }

    // ---- Helpers ----

    private String formatStatus(ApplicationStatus status) {
        switch (status) {
            case ACCEPTED: return "Accepted 🎉";
            case REJECTED: return "Rejected";
            case UNDER_REVIEW: return "Under Review";
            case APPLIED: return "Applied";
            case WITHDRAWN: return "Withdrawn";
            default: return status.name();
        }
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .type(n.getType())
                .title(n.getTitle())
                .message(n.getMessage())
                .relatedJobId(n.getRelatedJobId())
                .relatedApplicationId(n.getRelatedApplicationId())
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}