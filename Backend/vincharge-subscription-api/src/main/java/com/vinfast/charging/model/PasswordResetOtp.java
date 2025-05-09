package com.vinfast.charging.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "password_reset_otp", schema = "vcs")
public class PasswordResetOtp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "password_reset_otp_id")
    private Long passwordResetOtpId;

    @Column(nullable = false)
    private String email;

    @Column(name = "otp_code", nullable = false)
    private String otpCode;

    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    @Column(name = "reset_token", nullable = true)
    private String resetToken;

    @Column(nullable = false)
    private boolean used;

    // Check if OTP is expired
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }
}
