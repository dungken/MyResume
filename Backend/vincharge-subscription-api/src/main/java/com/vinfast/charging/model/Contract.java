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
@Table(name = "contracts", schema = "vcs")
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contract_id")
    private Long contractId;

    @Column(name = "contract_code", nullable = false, length = 20)
    private String contractCode;

    @Column(name = "limit_amount")
    private BigDecimal limitAmount;

    @Column(name = "phone", nullable = false, length = 11)
    private String phone;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_date", columnDefinition = "timestamp default now()")
    private LocalDateTime createdDate;

    @PrePersist
    protected void onCreate() {
        if (this.createdDate == null) {
            this.createdDate = LocalDateTime.now();
        }
    }
}
