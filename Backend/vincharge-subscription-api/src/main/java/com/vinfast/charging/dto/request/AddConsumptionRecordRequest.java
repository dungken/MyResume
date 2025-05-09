package com.vinfast.charging.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddConsumptionRecordRequest {
    @NotNull(message = "contractId is required")
    private Long contractId;
    @NotNull(message = "solarKwh is required")
    private Double solarKwh;
    @NotNull(message = "evnKwh is required")
    private Double evnKwh;
    @NotNull(message = "vinfastKwh is required")
    private Double vinfastKwh;
}
