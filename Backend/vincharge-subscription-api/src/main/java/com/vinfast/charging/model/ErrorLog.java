package com.vinfast.charging.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "error_log", schema = "vcs")
public class ErrorLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "error_log_id")
    private Long errorLogId;
    
    @Column(name = "error_code", length = 10)
    private String errorCode;
    
    @Column(name = "error_api", length = 50)
    private String errorApi;
    
    @Column(name = "error_reason")
    private String errorReason;
    
    @Column(name = "created_date")
    private LocalDateTime createdDate;
    
    // Default constructor
    public ErrorLog() {
        this.createdDate = LocalDateTime.now();
    }
    
    // Constructor with parameters
    public ErrorLog(String errorCode, String errorApi, String errorReason) {
        this.errorCode = errorCode;
        this.errorApi = errorApi;
        this.errorReason = errorReason;
        this.createdDate = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getErrorLogId() {
        return errorLogId;
    }

    public void setErrorLogId(Long errorLogId) {
        this.errorLogId = errorLogId;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorApi() {
        return errorApi;
    }

    public void setErrorApi(String errorApi) {
        this.errorApi = errorApi;
    }

    public String getErrorReason() {
        return errorReason;
    }

    public void setErrorReason(String errorReason) {
        this.errorReason = errorReason;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
}