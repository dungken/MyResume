package com.vinfast.charging.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "unit_price", schema = "vcs")
public class UnitPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "unit_price_id")
    private Long unitPriceId;

    @Column(name = "price_per_kwh", nullable = false)
    private Double pricePerKwh;

    @Column(name = "created_date", columnDefinition = "timestamp default now()")
    private LocalDateTime createdDate;
}
