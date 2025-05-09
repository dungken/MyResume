package com.vinfast.charging.service.vnpay;

import com.vinfast.charging.config.VNPayConfig;
import com.vinfast.charging.util.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

import lombok.extern.slf4j.Slf4j;

/**
 * Service for handling VNPay payment operations, directly based on VNPay's
 * sample implementation
 */
@Service
@Slf4j
public class VNPayService {

    @Autowired
    private VNPayConfig vnPayConfig;

    /**
     * Creates a payment URL for VNPay gateway
     * 
     * @param amount    Payment amount
     * @param orderInfo Description for the payment
     * @param txnRef    Transaction reference ID
     * @param request   HTTP request to get IP and other info
     * @return URL to redirect user to VNPay payment gateway
     */
    public String createPaymentUrl(BigDecimal amount, String orderInfo, String txnRef, HttpServletRequest request) {
        // log.info("Creating payment URL with amount: {}, orderInfo: {}, txnRef: {}",
        // amount, orderInfo, txnRef);

        // Get base parameters map from config - using TreeMap for consistent ordering
        Map<String, String> vnpParams = new TreeMap<>();
        vnpParams.putAll(vnPayConfig.getVNPayBaseConfig());

        // Add payment specific parameters
        vnpParams.put("vnp_Amount", String.valueOf(amount.multiply(new BigDecimal(100)).longValue()));
        vnpParams.put("vnp_TxnRef", txnRef);
        vnpParams.put("vnp_OrderInfo", orderInfo);
        vnpParams.put("vnp_OrderType", "250000"); // Payment for service
        vnpParams.put("vnp_IpAddr", VNPayUtil.getIpAddress(request));

        // Print params for debugging
        // vnpParams.forEach((key, value) -> log.info("Parameter: {} = {}", key,
        // value));

        // Build HASH_DATA string for signature generation - using VNPay's exact format
        StringBuilder hashData = new StringBuilder();
        for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
            if (entry.getValue() != null && !entry.getValue().isEmpty()) {
                if (hashData.length() > 0) {
                    hashData.append('&');
                }
                hashData.append(entry.getKey()).append('=')
                        .append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII));
            }
        }

        // Debug hash data string
        // log.info("Hash data string: {}", hashData);

        // Generate secure hash using HMAC-SHA512
        String secureHash = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
        // log.info("Generated secure hash: {}", secureHash);

        // Build query URL with encoded parameters
        StringBuilder queryUrl = new StringBuilder();
        for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
            if (entry.getValue() != null && !entry.getValue().isEmpty()) {
                if (queryUrl.length() > 0) {
                    queryUrl.append('&');
                }
                try {
                    queryUrl.append(URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII.toString()))
                            .append('=')
                            .append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    // log.error("Error encoding URL parameters", e);
                }
            }
        }

        // Build final payment URL
        String paymentUrl = vnPayConfig.getPaymentUrl() + "?" + queryUrl + "&vnp_SecureHash=" + secureHash;

        // log.info("Final payment URL: {}", paymentUrl);
        return paymentUrl;
    }

    /**
     * Processes the return request from VNPay
     * 
     * @param request HTTP request with VNPay response parameters
     * @return 1 if payment successful, 0 if payment failed, -1 if invalid signature
     */
    public int processPaymentReturn(HttpServletRequest request) {
        // Extract and encode parameters exactly as in VNPay demo
        Map<String, String> fields = new HashMap<>();

        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = null;
            String fieldValue = null;
            try {
                fieldName = (String) params.nextElement();
                fieldValue = request.getParameter(fieldName);

                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    // Store raw values in the map
                    fields.put(fieldName, fieldValue);
                }
            } catch (Exception e) {
                log.error("Error processing parameter: {}", fieldName, e);
            }
        }

        // log.info("Return - VNPay Parameters: {}", fields);

        // Get secure hash from request
        String vnpSecureHash = request.getParameter("vnp_SecureHash");

        // Remove hash params for signature verification
        Map<String, String> signatureFields = new HashMap<>(fields);
        if (signatureFields.containsKey("vnp_SecureHashType")) {
            signatureFields.remove("vnp_SecureHashType");
        }
        if (signatureFields.containsKey("vnp_SecureHash")) {
            signatureFields.remove("vnp_SecureHash");
        }

        // Sort field names for consistent hash
        List<String> fieldNames = new ArrayList<>(signatureFields.keySet());
        Collections.sort(fieldNames);

        // Build hash data string for verification
        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = signatureFields.get(fieldName);

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

        // log.info("Return - Hash data for verification: {}", hashData.toString());

        // Calculate hash for verification
        String calculatedHash = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());

        // log.info("Return - Calculated hash: {}", calculatedHash);
        // log.info("Return - VNPay provided hash: {}", vnpSecureHash);

        // Verify signature
        if (calculatedHash.equals(vnpSecureHash)) {
            // Check transaction status
            String responseCode = request.getParameter("vnp_ResponseCode");
            if (VNPayConfig.RESPONSE_CODE_SUCCESS.equals(responseCode)) {
                // log.info("Payment successful!");
                return 1; // Success
            } else {
                // log.info("Payment failed with response code: {}", responseCode);
                return 0; // Failed
            }
        } else {
            // log.error("Invalid signature: calculated '{}' vs. provided '{}'",
            // calculatedHash, vnpSecureHash);
            return -1; // Invalid signature
        }
    }
}
