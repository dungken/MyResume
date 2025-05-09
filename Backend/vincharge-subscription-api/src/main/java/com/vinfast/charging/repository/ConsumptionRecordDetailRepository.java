package com.vinfast.charging.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vinfast.charging.model.ConsumptionRecordDetail;

@Repository
public interface ConsumptionRecordDetailRepository extends JpaRepository<ConsumptionRecordDetail, Long> {

    List<ConsumptionRecordDetail> findByConsumptionRecordId(Long consumptionRecordId);

    @Modifying
    @Query("UPDATE ConsumptionRecordDetail d SET d.kwhNumber = :kwhNumber, d.imageUrl = :imageUrl, d.imageId = :imageId "
            + "WHERE d.consumptionRecordDetailId = :detailId")
    int updateDetail(@Param("kwhNumber") Double kwhNumber,
            @Param("imageUrl") String imageUrl,
            @Param("imageId") String imageId,
            @Param("detailId") Long detailId);
}
