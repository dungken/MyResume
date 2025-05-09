package com.dungken.scientificresearch2024backend.service;

public interface MailService {
    public void sendMail(String from, String to, String subject, String text);
}
