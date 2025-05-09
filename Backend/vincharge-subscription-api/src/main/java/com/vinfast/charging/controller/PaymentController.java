package com.vinfast.charging.controller;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vinfast.charging.dto.response.ApiResponse;
import com.vinfast.charging.dto.response.vnpay.VNPayResponse;
import com.vinfast.charging.service.PaymentService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/payment")
@Slf4j
public class PaymentController {

    @Autowired
    private PaymentService paymentService;
    
    /**
     * Create a payment URL for VNPAY
     * 
     * @param amount             - payment amount
     * @param consumptionRecordId - ID of the consumption record being paid
     * @param request            - HTTP request
     * @return URL to redirect to VNPAY payment gateway
     */
    @GetMapping("/create-url")
    public ResponseEntity<ApiResponse<VNPayResponse>> createPaymentUrl(
            @RequestParam BigDecimal amount,
            @RequestParam Long consumptionRecordId,
            HttpServletRequest request) {
        
        try {
            String orderInfo = "Thanh toan tien dien VinCharge #" + consumptionRecordId;
            String paymentUrl = paymentService.createPaymentUrl(amount, orderInfo, consumptionRecordId, request);
            
            // Create a proper VNPay response object
            VNPayResponse vnpayResponse = VNPayResponse.builder()
                .code("ok")
                .message("success")
                .paymentUrl(paymentUrl)
                .build();
                
            return ResponseEntity.ok(ApiResponse.success("Payment URL created", vnpayResponse));
        } catch (Exception e) {
            log.error("Error creating payment URL", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error creating payment URL: " + e.getMessage()));
        }
    }

    /**
     * Payment return URL - process the payment response from VNPAY
     * 
     * @param request - HTTP request with payment result parameters
     * @return payment result
     */
    @GetMapping("/vnpay-return")
    public ResponseEntity<ApiResponse<?>> paymentReturn(HttpServletRequest request) {
        ApiResponse<?> response = paymentService.processPaymentReturn(request);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * IPN (Instant Payment Notification) endpoint for VNPAY
     * This is called by VNPAY servers to notify of payment status
     * 
     * @param request - HTTP request with payment notification parameters
     * @return "00" if processed successfully, error code if failed
     */
    @PostMapping("/vnpay-ipn")
    public ResponseEntity<String> paymentIpn(HttpServletRequest request) {
        String response = paymentService.processPaymentIpn(request);
        return ResponseEntity.ok(response);
    }
}