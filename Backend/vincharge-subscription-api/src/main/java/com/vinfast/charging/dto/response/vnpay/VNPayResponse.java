package com.vinfast.charging.dto.response.vnpay;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for VNPay payment response
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VNPayResponse {
    private String code;
    private String message;
    private String paymentUrl;
}
