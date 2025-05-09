package com.vinfast.charging.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GetConsumptionRequest {
    @NotNull(message = "contractId is required")
    private Long contractId;
}
