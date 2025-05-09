package com.vinfast.charging.model;

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
@Table(name = "consumption_record_details", schema = "vcs")
public class ConsumptionRecordDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consumption_record_detail_id")
    private Long consumptionRecordDetailId;

    @Column(name = "consumption_record_id")
    private Long consumptionRecordId;

    @Column(name = "kwh_number")
    private Double kwhNumber;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "\"type\"")
    private Integer type;

    @Column(name = "created_date", columnDefinition = "timestamp default now()")
    private LocalDateTime createdDate;

    @Column(name = "image_id", length = 150)
    private String imageId;

    @PrePersist
    protected void onCreate() {
        if (this.createdDate == null) {
            this.createdDate = LocalDateTime.now();
        }
    }

    public ConsumptionRecordDetail(Long consumptionRecordId, Double kwhNumber, String imageUrl, Integer type,
            String imageId) {
        this.consumptionRecordId = consumptionRecordId;
        this.kwhNumber = kwhNumber;
        this.imageUrl = imageUrl;
        this.type = type;
        this.imageId = imageId;
    }
}
