package com.vinfast.charging.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import com.vinfast.charging.util.VNPayUtil;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;
import java.util.TreeMap;

import lombok.Getter;

@Configuration
@Getter
public class VNPayConfig {
    @Value("${vnpay.terminal-id}")
    private String terminalId;

    @Value("${vnpay.hash-secret}")
    private String hashSecret;

    @Value("${vnpay.payment-url}")
    private String paymentUrl;

    @Value("${vnpay.return-url}")
    private String returnUrl;

    @Value("${vnpay.ipn-url}")
    private String ipnUrl;

    // VNPAY currency code (VND)
    public static final String VND = "VND";

    // VNPAY command code for pay
    public static final String PAY = "pay";

    // VNPAY Version
    public static final String VERSION = "2.1.0";

    // VNPAY payment Success Code
    public static final String RESPONSE_CODE_SUCCESS = "00";

    /**
     * Create a base map with default VNPay configuration parameters
     * 
     * @return Map containing base VNPay parameters
     */
    public Map<String, String> getVNPayBaseConfig() {
        // Use TreeMap to maintain consistent order of keys (important for hash
        // generation)
        Map<String, String> vnpParamsMap = new TreeMap<>();
        vnpParamsMap.put("vnp_Version", VERSION);
        vnpParamsMap.put("vnp_Command", PAY);
        vnpParamsMap.put("vnp_TmnCode", this.terminalId);
        vnpParamsMap.put("vnp_CurrCode", VND);
        vnpParamsMap.put("vnp_Locale", "vn");
        vnpParamsMap.put("vnp_ReturnUrl", this.returnUrl);

        // Set create date in GMT+7
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String createDate = formatter.format(calendar.getTime());
        vnpParamsMap.put("vnp_CreateDate", createDate);

        // Set expire date (15 minutes after creation)
        calendar.add(Calendar.MINUTE, 15);
        String expireDate = formatter.format(calendar.getTime());
        vnpParamsMap.put("vnp_ExpireDate", expireDate);

        return vnpParamsMap;
    }
}