package com.vinfast.charging.dto.request;

import com.vinfast.charging.validation.PasswordValidator;
import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Data
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    @Size(max = 20, message = "Username must be no more than 20 characters")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Username must contain only letters and numbers")
    private String username;
    
    @NotBlank(message = "Password is required")
    @PasswordValidator
    private String password;
    
    @NotBlank(message = "Full name is required")
    @Size(max = 50, message = "Full name must be no more than 50 characters")
    private String full_name;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(
        regexp = "^(0[3-9][0-9]{8})$",
        message = "Must be a valid Vietnamese phone number"
    )
    private String phone;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    @Pattern(
        regexp = "^[a-zA-Z0-9._%+-]+@gmail\\.com$",
        message = "Must be a valid Gmail address"
    )
    private String email;
}
