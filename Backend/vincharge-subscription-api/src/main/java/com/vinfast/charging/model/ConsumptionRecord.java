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
@Table(name = "consumption_records", schema = "vcs")
public class ConsumptionRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consumption_record_id")
    private Long consumptionRecordId;

    @Column(name = "contract_id")
    private Long contractId;

    @Column(name = "income_month")
    private BigDecimal incomeMonth;

    @Column(name = "total_income")
    private BigDecimal totalIncome;

    @Column(name = "balance")
    private BigDecimal balance;

    @Column(name = "is_paid")
    private Boolean isPaid;

    @Column(name = "created_date", columnDefinition = "timestamp default now()")
    private LocalDateTime createdDate;

    @Column(name = "price_per_kwh", nullable = false)
    private Double pricePerKwh;

    @PrePersist
    protected void onCreate() {
        if (this.createdDate == null) {
            this.createdDate = LocalDateTime.now();
        }
    }

    public ConsumptionRecord(Long contractId, BigDecimal incomeMonth, BigDecimal totalIncome, BigDecimal balance, Boolean isPaid, Double pricePerKwh) {
        this.contractId = contractId;
        this.incomeMonth = incomeMonth;
        this.totalIncome = totalIncome;
        this.balance = balance;
        this.isPaid = isPaid;
        this.pricePerKwh = pricePerKwh;
    }
}
