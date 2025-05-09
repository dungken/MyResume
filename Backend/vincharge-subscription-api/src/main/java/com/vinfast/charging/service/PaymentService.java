package com.vinfast.charging.service;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vinfast.charging.config.VNPayConfig;
import com.vinfast.charging.dto.response.ApiResponse;
import com.vinfast.charging.model.ConsumptionRecord;
import com.vinfast.charging.model.PaymentTransaction;
import com.vinfast.charging.repository.ConsumptionRecordRepository;
import com.vinfast.charging.repository.PaymentTransactionRepository;
import com.vinfast.charging.service.vnpay.VNPayService;
import com.vinfast.charging.util.VNPayUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PaymentService {

    @Autowired
    private VNPayConfig vnPayConfig;

    @Autowired
    private ConsumptionRecordRepository consumptionRecordRepository;

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    private ErrorLogService errorLogService;

    @Autowired
    private VNPayService vnPayService;

    /**
     * Generate VNPay payment URL
     * 
     * @param amount              - payment amount
     * @param orderInfo           - description for the payment
     * @param consumptionRecordId - ID of the consumption record being paid
     * @param request             - HTTP request to get IP and other info
     * @return URL to redirect user to VNPay payment gateway
     */
    public String createPaymentUrl(BigDecimal amount, String orderInfo, Long consumptionRecordId,
            HttpServletRequest request) {
        try {
            // Check if consumption record exists and is not already paid
            Optional<ConsumptionRecord> recordOpt = consumptionRecordRepository.findById(consumptionRecordId);
            if (recordOpt.isEmpty()) {
                throw new IllegalArgumentException("Consumption record not found: " + consumptionRecordId);
            }

            ConsumptionRecord record = recordOpt.get();
            if (record.getIsPaid()) {
                throw new IllegalArgumentException("Consumption record already paid: " + consumptionRecordId);
            }

            // Check if a transaction already exists for this consumption record
            List<PaymentTransaction> transactions = paymentTransactionRepository
                    .findByConsumptionRecordId(consumptionRecordId);
            Optional<PaymentTransaction> existingTransactionOpt = transactions.isEmpty() ? Optional.empty()
                    : Optional.of(transactions.get(0));

            PaymentTransaction transaction;
            String txnRef;

            if (existingTransactionOpt.isPresent()) {
                // Update existing transaction
                transaction = existingTransactionOpt.get();
                txnRef = consumptionRecordId + "-" + VNPayUtil.getRandomNumber(8);
                transaction.setAmount(amount);
                transaction.setTransactionReference(txnRef);
                transaction.setStatus(PaymentTransaction.STATUS_PENDING);
            } else {
                // Create new transaction
                txnRef = consumptionRecordId + "-" + VNPayUtil.getRandomNumber(8);
                transaction = new PaymentTransaction(consumptionRecordId, txnRef, amount,
                        PaymentTransaction.STATUS_PENDING);
            }

            paymentTransactionRepository.save(transaction);

            // Use VNPayService to create payment URL
            return vnPayService.createPaymentUrl(amount, orderInfo, txnRef, request);

        } catch (Exception e) {
            // log.error("Error creating payment URL", e);
            e.printStackTrace();
            errorLogService.logError("/api/payment/create-url", e.toString());
            throw new RuntimeException("Error creating payment URL: " + e.getMessage());
        }
    }

    /**
     * Process VNPay payment response (return URL callback)
     * 
     * @param request - HTTP request with payment result parameters
     * @return API Response with payment result
     */
    @Transactional
    public ApiResponse<?> processPaymentReturn(HttpServletRequest request) {
        try {
            // log.info("Processing payment return from VNPay");

            // Use the VNPayService to verify the signature
            int paymentResult = vnPayService.processPaymentReturn(request);

            if (paymentResult == -1) {
                // log.error("Invalid signature in payment return");
                return ApiResponse.error("Invalid signature");
            }

            // Get transaction information
            String txnRef = request.getParameter("vnp_TxnRef");
            String responseCode = request.getParameter("vnp_ResponseCode");

            // Extract consumption record ID from txnRef (format: "recordId-randomNumber")
            Long consumptionRecordId = Long.parseLong(txnRef.split("-")[0]);

            // log.info("Processing payment for consumption record: {}, txnRef: {},
            // responseCode: {}",
            // consumptionRecordId, txnRef, responseCode);

            // Update payment status in the database if payment successful
            if (paymentResult == 1 && VNPayConfig.RESPONSE_CODE_SUCCESS.equals(responseCode)) {
                Optional<ConsumptionRecord> recordOpt = consumptionRecordRepository.findById(consumptionRecordId);

                if (recordOpt.isPresent()) {
                    ConsumptionRecord record = recordOpt.get();

                    // Check if not already paid (prevent duplicate processing)
                    if (!record.getIsPaid()) {
                        record.setIsPaid(true);
                        consumptionRecordRepository.save(record);
                        // log.info("Marked consumption record {} as paid", consumptionRecordId);

                        // Update transaction status
                        Optional<PaymentTransaction> transactionOpt = paymentTransactionRepository
                                .findByTransactionReference(txnRef);
                        if (transactionOpt.isPresent()) {
                            PaymentTransaction transaction = transactionOpt.get();
                            transaction.setStatus(PaymentTransaction.STATUS_SUCCESS);
                            transaction.setResponseCode(responseCode);
                            transaction.setBankCode(request.getParameter("vnp_BankCode"));
                            transaction.setUpdatedDate(LocalDateTime.now());
                            paymentTransactionRepository.save(transaction);
                            // log.info("Updated transaction {} status to SUCCESS", txnRef);
                        }
                    }
                    // else {
                    // log.info("Consumption record {} already marked as paid",
                    // consumptionRecordId);
                    // }

                    return ApiResponse.success("Payment successful");
                } else {
                    // log.error("Consumption record not found: {}", consumptionRecordId);
                    return ApiResponse.error("Consumption record not found: " + consumptionRecordId);
                }
            } else {
                // Update transaction for failed payment
                Optional<PaymentTransaction> transactionOpt = paymentTransactionRepository
                        .findByTransactionReference(txnRef);
                if (transactionOpt.isPresent()) {
                    PaymentTransaction transaction = transactionOpt.get();
                    transaction.setStatus(PaymentTransaction.STATUS_FAILED);
                    transaction.setResponseCode(responseCode);
                    transaction.setResponseMessage("Payment failed with code: " + responseCode);
                    transaction.setBankCode(request.getParameter("vnp_BankCode"));
                    transaction.setUpdatedDate(LocalDateTime.now());
                    paymentTransactionRepository.save(transaction);
                    // log.info("Updated transaction {} status to FAILED", txnRef);
                }

                return ApiResponse.error("Payment failed with code: " + responseCode);
            }

        } catch (Exception e) {
            // log.error("Error processing payment return", e);
            errorLogService.logError("/api/payment/process-return", e.toString());
            return ApiResponse.error("Error processing payment: " + e.getMessage());
        }
    }

    /**
     * Process VNPay IPN (Instant Payment Notification)
     * 
     * @param request - HTTP request with payment notification parameters
     * @return "00" if processed successfully, "99" if failed
     */
    @Transactional
    public String processPaymentIpn(HttpServletRequest request) {
        try {
            // log.info("Processing IPN notification from VNPay");

            // Get parameters from request
            Map<String, String> fields = VNPayUtil.getParametersMap(request);

            // Get secure hash from request
            String vnpSecureHash = request.getParameter("vnp_SecureHash");

            // Remove hash value for comparison
            if (fields.containsKey("vnp_SecureHashType")) {
                fields.remove("vnp_SecureHashType");
            }
            if (fields.containsKey("vnp_SecureHash")) {
                fields.remove("vnp_SecureHash");
            }

            // Sort field names for consistent hash
            List<String> fieldNames = new ArrayList<>(fields.keySet());
            Collections.sort(fieldNames);

            // Build hash data string for verification
            StringBuilder hashData = new StringBuilder();
            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = fields.get(fieldName);

                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName);
                    hashData.append('=');
                    try {
                        hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    } catch (UnsupportedEncodingException e) {
                        log.error("Error encoding parameter for hash: {}", fieldName, e);
                    }

                    if (itr.hasNext()) {
                        hashData.append('&');
                    }
                }
            }

            // log.info("IPN - Hash data for verification: {}", hashData.toString());

            // Calculate hash for verification
            String calculatedHash = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());

            // log.info("IPN - Calculated hash: {}", calculatedHash);
            // log.info("IPN - VNPay provided hash: {}", vnpSecureHash);

            // Verify signature
            if (!calculatedHash.equals(vnpSecureHash)) {
                // log.error("IPN - Invalid signature");
                return "97"; // Invalid signature
            }

            // Get transaction info
            String responseCode = request.getParameter("vnp_ResponseCode");
            String txnRef = request.getParameter("vnp_TxnRef");

            // Extract consumption record ID from txnRef (format: "recordId-randomNumber")
            Long consumptionRecordId = Long.parseLong(txnRef.split("-")[0]);

            // log.info("IPN - Processing for consumption record: {}, txnRef: {},
            // responseCode: {}",
            // consumptionRecordId, txnRef, responseCode);

            // Update payment status in the database if payment successful
            if (VNPayConfig.RESPONSE_CODE_SUCCESS.equals(responseCode)) {
                Optional<ConsumptionRecord> recordOpt = consumptionRecordRepository.findById(consumptionRecordId);

                if (recordOpt.isPresent()) {
                    ConsumptionRecord record = recordOpt.get();

                    // Check if not already paid (prevent duplicate processing)
                    if (!record.getIsPaid()) {
                        record.setIsPaid(true);
                        consumptionRecordRepository.save(record);
                        // log.info("IPN - Marked consumption record {} as paid", consumptionRecordId);

                        // Update transaction status
                        Optional<PaymentTransaction> transactionOpt = paymentTransactionRepository
                                .findByTransactionReference(txnRef);
                        if (transactionOpt.isPresent()) {
                            PaymentTransaction transaction = transactionOpt.get();
                            transaction.setStatus(PaymentTransaction.STATUS_SUCCESS);
                            transaction.setResponseCode(responseCode);
                            transaction.setBankCode(request.getParameter("vnp_BankCode"));
                            transaction.setUpdatedDate(LocalDateTime.now());
                            paymentTransactionRepository.save(transaction);
                            // log.info("IPN - Updated transaction {} status to SUCCESS", txnRef);
                        }
                    }
                    // else {
                    // log.info("IPN - Consumption record {} already marked as paid",
                    // consumptionRecordId);
                    // }

                    return "00"; // Success
                } else {
                    // log.error("IPN - Consumption record not found: {}", consumptionRecordId);
                    return "01"; // Order not found
                }
            } else {
                // log.info("IPN - Payment failed with code: {}", responseCode);
                return "00"; // Still acknowledge receipt of notification
            }

        } catch (Exception e) {
            // log.error("Error processing payment IPN", e);
            errorLogService.logError("/api/payment/ipn", e.toString());
            return "99"; // Error
        }
    }
}