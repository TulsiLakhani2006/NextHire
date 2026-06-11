package com.backend.dto;

import com.backend.model.Role;
import lombok.*;

@Data
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String name;
    private String email;
    private Role role;
}