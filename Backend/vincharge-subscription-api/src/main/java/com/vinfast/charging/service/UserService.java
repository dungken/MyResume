package com.vinfast.charging.service;

import com.vinfast.charging.dto.request.*;
import com.vinfast.charging.dto.response.*;
import com.vinfast.charging.model.PasswordResetOtp;
import com.vinfast.charging.model.User;
import com.vinfast.charging.repository.PasswordResetOtpRepository;
import com.vinfast.charging.repository.UserRepository;
import com.vinfast.charging.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetOtpRepository otpRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ErrorLogService errorLogService;

    public ApiResponse<UserResponse> login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtUtil.generateToken(user.getUsername(), user.getUserId());

            UserResponse userResponse = new UserResponse(
                    user.getUserId(),
                    user.getUsername(),
                    user.getFullname(),
                    token);

            logger.info("User {} logged in successfully", request.getUsername());
            return ApiResponse.success("Login successful", userResponse);
        } catch (Exception e) {
            // Log the error
            errorLogService.logError("/api/auth/login", "Login failed for user: " + request.getUsername());
            logger.error("Login failed for user: {}", request.getUsername(), e);
            return ApiResponse.error("Invalid username or password");
        }
    }

    public ApiResponse<UserResponse> register(RegisterRequest request) {
        try {
            // Check if username, email, or phone already exists
            if (userRepository.existsByUsername(request.getUsername())) {
                errorLogService.logError("/api/auth/register", "Username already exists: " + request.getUsername());
                return ApiResponse.error("Username already exists");
            }

            if (userRepository.existsByEmail(request.getEmail())) {
                errorLogService.logError("/api/auth/register", "Email already exists: " + request.getEmail());
                return ApiResponse.error("Email already exists");
            }

            if (userRepository.existsByPhone(request.getPhone())) {
                errorLogService.logError("/api/auth/register", "Phone number already exists: " + request.getPhone());
                return ApiResponse.error("Phone number already exists");
            }

            // Create new user
            User user = new User();
            user.setUsername(request.getUsername());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setFullname(request.getFull_name());
            user.setPhone(request.getPhone());
            user.setEmail(request.getEmail());

            User savedUser = userRepository.save(user);

            UserResponse userResponse = new UserResponse(
                    savedUser.getUserId(),
                    savedUser.getUsername(),
                    savedUser.getFullname());

            logger.info("User registered successfully: {}", request.getUsername());
            return ApiResponse.success("Registration successful", userResponse);
        } catch (Exception e) {
            errorLogService.logError("/api/auth/register", "Registration failed: " + e.getMessage());
            logger.error("Registration failed for user: {}", request.getUsername(), e);
            return ApiResponse.error("Registration failed: " + e.getMessage());
        }
    }

    public ApiResponse<?> forgotPassword(ForgotPasswordRequest request) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

            if (!userOpt.isPresent()) {
                errorLogService.logError("/api/auth/forgot-password", "Email not found: " + request.getEmail());
                logger.warn("Password reset attempted for non-existent email: {}", request.getEmail());
                return ApiResponse.error("Email not found");
            }

            User user = userOpt.get();
            String otpCode = jwtUtil.generateOtpCode();

            // Save OTP to database
            PasswordResetOtp otp = new PasswordResetOtp();
            otp.setEmail(request.getEmail());
            otp.setOtpCode(otpCode);
            otp.setExpiryDate(LocalDateTime.now().plusMinutes(2)); // OTP expires in 2 minutes
            otp.setUsed(false);

            otpRepository.save(otp);

            // Send OTP via email
            boolean emailSent = emailService.sendOtpEmail(request.getEmail(), user.getUsername(), otpCode);

            if (!emailSent) {
                errorLogService.logError("/api/auth/forgot-password",
                        "Failed to send OTP email to: " + request.getEmail());
                logger.error("Failed to send OTP email to: {}", request.getEmail());
                return ApiResponse.error("Failed to send OTP email. Please try again later.");
            }

            logger.info("Password reset OTP sent to: {}", request.getEmail());
            return ApiResponse.success(
                    "OTP and username have been sent to your email. Please check and enter the OTP within 2 minutes.");
        } catch (Exception e) {
            errorLogService.logError("/api/auth/forgot-password",
                    "Failed to process password reset: " + e.getMessage());
            logger.error("Failed to process password reset for: {}", request.getEmail(), e);
            return ApiResponse.error("Failed to process password reset. Please try again later.");
        }
    }

    public ApiResponse<OtpVerificationResponse> verifyOtp(VerifyOtpRequest request) {
        try {
            Optional<PasswordResetOtp> otpOpt = otpRepository.findByEmailAndOtpCodeAndUsedFalse(
                    request.getEmail(),
                    request.getOtp_code());

            if (!otpOpt.isPresent()) {
                errorLogService.logError("/api/auth/verify-otp", "Invalid OTP for email: " + request.getEmail());
                logger.warn("Invalid OTP attempt for email: {}", request.getEmail());
                return ApiResponse.error("Invalid or expired OTP. Please request a new OTP.");
            }

            PasswordResetOtp otp = otpOpt.get();

            // Check if OTP is expired
            if (otp.isExpired()) {
                errorLogService.logError("/api/auth/verify-otp", "Expired OTP for email: " + request.getEmail());
                logger.warn("Expired OTP used for email: {}", request.getEmail());
                return ApiResponse.error("OTP has expired. Please request a new OTP.");
            }

            // Generate reset token
            String resetToken = jwtUtil.generateResetToken();
            otp.setResetToken(resetToken);
            otpRepository.save(otp);

            OtpVerificationResponse response = new OtpVerificationResponse(resetToken);

            logger.info("OTP verified successfully for email: {}", request.getEmail());
            return ApiResponse.success("OTP verified successfully. You can now reset your password.", response);
        } catch (Exception e) {
            errorLogService.logError("/api/auth/verify-otp", "Failed to verify OTP: " + e.getMessage());
            logger.error("Failed to verify OTP for email: {}", request.getEmail(), e);
            return ApiResponse.error("Failed to verify OTP. Please try again later.");
        }
    }

    public ApiResponse<?> updatePassword(UpdatePasswordRequest request) {
        try {
            Optional<PasswordResetOtp> otpOpt = otpRepository.findByEmailAndResetTokenAndUsedFalse(
                    request.getEmail(),
                    request.getReset_token());

            if (!otpOpt.isPresent()) {
                errorLogService.logError("/api/auth/update-password",
                        "Invalid reset token for email: " + request.getEmail());
                logger.warn("Invalid reset token used for email: {}", request.getEmail());
                return ApiResponse.error("Invalid or expired reset token");
            }

            PasswordResetOtp otp = otpOpt.get();

            // Check if token is expired (using same expiry as OTP)
            if (otp.isExpired()) {
                errorLogService.logError("/api/auth/update-password",
                        "Expired reset token for email: " + request.getEmail());
                logger.warn("Expired reset token used for email: {}", request.getEmail());
                return ApiResponse.error("Reset token has expired. Please request a new password reset.");
            }

            // Update user's password
            Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

            if (!userOpt.isPresent()) {
                errorLogService.logError("/api/auth/update-password",
                        "User not found for email: " + request.getEmail());
                logger.error("User not found for email during password update: {}", request.getEmail());
                return ApiResponse.error("User not found");
            }

            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(request.getNew_password()));
            userRepository.save(user);

            // Mark OTP as used
            otp.setUsed(true);
            otpRepository.save(otp);

            logger.info("Password updated successfully for user: {}", user.getUsername());
            return ApiResponse.success("Password updated successfully. You can now log in with your new password.");
        } catch (Exception e) {
            errorLogService.logError("/api/auth/update-password", "Failed to update password: " + e.getMessage());
            logger.error("Failed to update password for email: {}", request.getEmail(), e);
            return ApiResponse.error("Failed to update password. Please try again later.");
        }
    }
}
