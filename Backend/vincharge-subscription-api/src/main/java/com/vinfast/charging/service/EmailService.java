package com.vinfast.charging.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public boolean sendOtpEmail(String to, String username, String otpCode) {
        try {
            // Use MimeMessage for more robust email support
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("VinCharge Subscription - Password Reset OTP");

            String htmlContent = "<html><body>" +
                    "<h2>VinCharge Subscription - Password Reset</h2>" +
                    "<p>Dear <b>" + username + "</b>,</p>" +
                    "<p>Your OTP code for password reset is: <h3 style='background-color: #f0f0f0; padding: 10px; display: inline-block'>"
                    + otpCode + "</h3></p>" +
                    "<p>This code will expire in <b>2 minutes</b>.</p>" +
                    "<p>If you did not request this password reset, please ignore this email.</p>" +
                    "<p>Regards,<br>VinCharge Subscription Team</p>" +
                    "</body></html>";

            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            logger.info("OTP email sent successfully to: {}", to);
            return true;
        } catch (MailException | MessagingException e) {
            logger.error("Failed to send OTP email to: {}", to, e);
            return false;
        }
    }
}
