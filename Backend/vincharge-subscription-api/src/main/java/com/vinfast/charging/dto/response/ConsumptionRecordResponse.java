package com.vinfast.charging.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.vinfast.charging.model.ConsumptionRecord;
import com.vinfast.charging.model.ConsumptionRecordDetail;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsumptionRecordResponse extends ConsumptionRecord {
    private String contractCode;
    private BigDecimal limitAmount;
    private List<ConsumptionRecordDetail> details;

    public ConsumptionRecordResponse(String contractCode, BigDecimal limitAmount,
            Long consumptionRecordId, Long contractId, BigDecimal incomeMonth,
            BigDecimal totalIncome, BigDecimal balance, Boolean isPaid, LocalDateTime createdDate, Double pricePerKwh,
            List<ConsumptionRecordDetail> details) {
        super(consumptionRecordId, contractId, incomeMonth, totalIncome, balance, isPaid, createdDate, pricePerKwh);
        this.contractCode = contractCode;
        this.limitAmount = limitAmount;
        this.details = details;
    }
}
