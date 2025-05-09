package com.vinfast.charging.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "payment_transactions", schema = "vcs")
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id")
    private Long transactionId;

    @Column(name = "consumption_record_id")
    private Long consumptionRecordId;

    @Column(name = "transaction_reference", length = 50)
    private String transactionReference;
    
    @Column(name = "amount")
    private BigDecimal amount;
    
    @Column(name = "status", length = 20)
    private String status;
    
    @Column(name = "payment_method", length = 50)
    private String paymentMethod;
    
    @Column(name = "response_code", length = 10)
    private String responseCode;
    
    @Column(name = "response_message", length = 255)
    private String responseMessage;
    
    @Column(name = "bank_code", length = 20)
    private String bankCode;
    
    @Column(name = "created_date", columnDefinition = "timestamp default now()")
    private LocalDateTime createdDate;
    
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
    }
    
    // Constructor for creating a new transaction record
    public PaymentTransaction(Long consumptionRecordId, String transactionReference, 
                              BigDecimal amount, String status) {
        this.consumptionRecordId = consumptionRecordId;
        this.transactionReference = transactionReference;
        this.amount = amount;
        this.status = status;
        this.paymentMethod = "VNPAY";
    }
    
    // Status constants
    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_SUCCESS = "SUCCESS";
    public static final String STATUS_FAILED = "FAILED";
    public static final String STATUS_CANCELLED = "CANCELLED";
}