package com.vinfast.charging.repository;

import com.vinfast.charging.model.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {
    
    Optional<PasswordResetOtp> findByEmailAndOtpCodeAndUsedFalse(String email, String otpCode);
    
    Optional<PasswordResetOtp> findByEmailAndResetTokenAndUsedFalse(String email, String resetToken);
}
