package com.backend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "notifications")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {

    @Id
    private String id;

    private String recipientId;     // candidate's user ID

    private NotificationType type;

    private String title;
    private String message;

    private String relatedJobId;        // for STATUS_CHANGE / NEW_MATCHING_JOB
    private String relatedApplicationId; // for STATUS_CHANGE

    private boolean read;

    private LocalDateTime createdAt;
}