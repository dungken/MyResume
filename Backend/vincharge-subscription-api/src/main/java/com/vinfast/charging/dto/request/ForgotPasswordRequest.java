package com.vinfast.charging.dto.request;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Data
public class ForgotPasswordRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    @Pattern(
        regexp = "^[a-zA-Z0-9._%+-]+@gmail\\.com$",
        message = "Must be a valid Gmail address"
    )
    private String email;
}
