package com.vinfast.charging.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.vinfast.charging.model.UnitPrice;

@Repository
public interface UnitPriceRepository extends JpaRepository<UnitPrice, Long> {
    @Query("SELECT u.pricePerKwh FROM UnitPrice u ORDER BY u.createdDate DESC")
    Double findLatestPricePerKwh();
}
