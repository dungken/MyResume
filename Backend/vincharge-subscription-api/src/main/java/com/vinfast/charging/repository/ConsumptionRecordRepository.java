package com.vinfast.charging.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vinfast.charging.model.ConsumptionRecord;

@Repository
public interface ConsumptionRecordRepository extends JpaRepository<ConsumptionRecord, Long> {

    Optional<ConsumptionRecord> findTopByContractIdOrderByCreatedDateDesc(Long contractId);

    List<ConsumptionRecord> findTop2ByContractIdOrderByCreatedDateDesc(Long contractId);

    @Modifying
    @Query("UPDATE ConsumptionRecord c SET c.incomeMonth = :incomeMonth, c.totalIncome = :totalIncome, " +
           "c.balance = :balance, c.isPaid = :isPaid WHERE c.consumptionRecordId = :recordId")
    int updateConsumptionRecord(@Param("incomeMonth") BigDecimal incomeMonth,
                                @Param("totalIncome") BigDecimal totalIncome,
                                @Param("balance") BigDecimal balance,
                                @Param("isPaid") Boolean isPaid,
                                @Param("recordId") Long recordId);
}
