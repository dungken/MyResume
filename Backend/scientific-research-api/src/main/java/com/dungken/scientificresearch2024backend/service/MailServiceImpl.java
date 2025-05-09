package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.service.MailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailServiceImpl implements MailService {

    private JavaMailSender emailSender;

    @Autowired
    public MailServiceImpl(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    @Override
    public void sendMail(String from, String to, String subject, String text) {
        // MimeMailMessage => có đính kèm media
        // SimpleMailMessage => nội dung thông thường

        MimeMessage message = emailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text,true);

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

        // thực hiện hành động gửi email
        emailSender.send(message);
    }


}
