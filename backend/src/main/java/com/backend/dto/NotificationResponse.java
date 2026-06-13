package com.backend.dto;

import java.time.LocalDateTime;

import com.backend.model.NotificationType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {
    private String id;
    private NotificationType type;
    private String title;
    private String message;
    private String relatedJobId;
    private String relatedApplicationId;
    private boolean read;
    private LocalDateTime createdAt;
}
