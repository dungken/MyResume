package com.vinfast.charging.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class LoginRequest {
    @NotBlank(message = "Username is required")
    @Size(max = 20, message = "Username must be no more than 20 characters")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;
}
