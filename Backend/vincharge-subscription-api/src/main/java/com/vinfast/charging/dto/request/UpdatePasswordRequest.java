package com.vinfast.charging.dto.request;

import com.vinfast.charging.validation.PasswordValidator;
import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Data
public class UpdatePasswordRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    @Pattern(
        regexp = "^[a-zA-Z0-9._%+-]+@gmail\\.com$",
        message = "Must be a valid Gmail address"
    )
    private String email;
    
    @NotBlank(message = "Reset token is required")
    private String reset_token;
    
    @NotBlank(message = "New password is required")
    @PasswordValidator
    private String new_password;
}
