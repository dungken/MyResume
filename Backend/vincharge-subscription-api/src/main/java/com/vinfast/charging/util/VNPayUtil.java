package com.vinfast.charging.util;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.TimeZone;
import java.util.stream.Collectors;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class VNPayUtil {

    /**
     * Generate HMAC SHA512 signature - Exact implementation following VNPay specifications
     * 
     * @param key  - Secret key
     * @param data - Data to sign
     * @return Hexadecimal string representation of the signature
     */
    public static String hmacSHA512(final String key, final String data) {
        try {
            if (key == null || data == null) {
                throw new NullPointerException();
            }
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes();
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception ex) {
            log.error("Error generating HMAC SHA512", ex);
            ex.printStackTrace();
            return "";
        }
    }

    public static String getRandomNumber(int len) {
        Random rnd = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }
    
    public static String getIpAddress(HttpServletRequest request) {
        String ipAddress;
        try {
            ipAddress = request.getHeader("X-FORWARDED-FOR");
            if (ipAddress == null) {
                ipAddress = request.getRemoteAddr();
            }
        } catch (Exception e) {
            ipAddress = "Invalid IP:" + e.getMessage();
        }
        return ipAddress;
    }
    
    public static String getFormattedDate() {
        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        return formatter.format(calendar.getTime());
    }

    public static Map<String, String> getParametersMap(HttpServletRequest request) {
        Map<String, String> parameters = new HashMap<>();
        Enumeration<String> paramNames = request.getParameterNames();
        
        while (paramNames.hasMoreElements()) {
            String paramName = paramNames.nextElement();
            String paramValue = request.getParameter(paramName);
            
            if (paramValue != null && !paramName.equals("vnp_SecureHash")) {
                parameters.put(paramName, paramValue);
            }
        }
        
        return parameters;
    }
    
    /**
     * Builds a hash from all fields based on VNPay's implementation
     * No URL encoding should be applied before creating the hash
     * 
     * @param fields Map of parameters to include in the hash
     * @param secretKey Secret key for HMAC
     * @return The HMAC SHA512 hash of the fields
     */
    public static String hashAllFields(Map<String, String> fields, String secretKey) {
        // Get list of all fields and sort them
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        
        // Build the hash data exactly as VNPay demo does, without URL encoding
        StringBuilder sb = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                sb.append(fieldName);
                sb.append('=');
                sb.append(fieldValue); // No URL encoding here
            }
            if (itr.hasNext()) {
                sb.append('&');
            }
        }
        
        return hmacSHA512(secretKey, sb.toString());
    }
    
    /**
     * Creates a correctly formatted string from sorted parameters for VNPay signature generation
     * @param fields The map of parameters to sort and format
     * @return A properly formatted string for HMAC generation
     */
    public static String createSortedParamString(Map<String, String> fields) {
        // Create a list of field names and sort them
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        
        StringBuilder hashData = new StringBuilder();
        Iterator<String> iterator = fieldNames.iterator();
        
        while (iterator.hasNext()) {
            String fieldName = iterator.next();
            String fieldValue = fields.get(fieldName);
            
            if (fieldValue != null && !fieldValue.isEmpty()) {
                // Important: DO NOT URL encode the values for the signature string
                hashData.append(fieldName).append('=').append(fieldValue);
                
                if (iterator.hasNext()) {
                    hashData.append('&');
                }
            }
        }
        
        return hashData.toString();
    }
    
    /**
     * Generates a payment URL using the provided parameters map
     * 
     * @param paramsMap Map of payment parameters
     * @param encodeKey Whether to URL encode parameter keys
     * @return URL parameter string with keys and values properly encoded
     */
    public static String getPaymentURL(Map<String, String> paramsMap, boolean encodeKey) {
        // Create a list from entries and sort by key
        List<Map.Entry<String, String>> entries = new ArrayList<>(paramsMap.entrySet());
        entries.removeIf(entry -> entry.getValue() == null || entry.getValue().isEmpty());
        Collections.sort(entries, Map.Entry.comparingByKey());
        
        // Build the string manually to have more control over the encoding
        StringBuilder sb = new StringBuilder();
        boolean first = true;
        
        for (Map.Entry<String, String> entry : entries) {
            if (!first) {
                sb.append("&");
            } else {
                first = false;
            }
            
            if (encodeKey) {
                try {
                    sb.append(URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    sb.append(entry.getKey()); // Fallback if encoding fails
                }
            } else {
                sb.append(entry.getKey());
            }
            
            sb.append("=");
            
            try {
                sb.append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII.toString()));
            } catch (UnsupportedEncodingException e) {
                sb.append(entry.getValue()); // Fallback if encoding fails
            }
        }
        
        return sb.toString();
    }
}