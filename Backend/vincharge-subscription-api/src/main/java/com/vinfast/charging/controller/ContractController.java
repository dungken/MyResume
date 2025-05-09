package com.vinfast.charging.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import com.vinfast.charging.dto.request.AddConsumptionRecordRequest;
import com.vinfast.charging.dto.response.ApiResponse;
import com.vinfast.charging.dto.response.ConsumptionRecordResponse;
import com.vinfast.charging.service.ContractService;

@RestController
@RequestMapping("/api/contract")
public class ContractController {
    @Autowired
    private ContractService consumptionRecordService;

    @PostMapping(value = "/consumption/add-record", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addRecord(
            @RequestPart("data") @Valid AddConsumptionRecordRequest request,
            @RequestPart("solarImg") MultipartFile solarImg,
            @RequestPart("evnImg") MultipartFile evnImg,
            @RequestPart("vinfastImg") MultipartFile vinfastImg) throws Exception {
        ApiResponse<?> response = consumptionRecordService.addConsumptionRecord(request, solarImg, evnImg, vinfastImg);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/consumption/update-record", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateRecord(
            @RequestPart("data") @Valid AddConsumptionRecordRequest request,
            @RequestPart("solarImg") MultipartFile solarImg,
            @RequestPart("evnImg") MultipartFile evnImg,
            @RequestPart("vinfastImg") MultipartFile vinfastImg) throws Exception {
        ApiResponse<?> response = consumptionRecordService.updateConsumptionRecord(request, solarImg, evnImg,
                vinfastImg);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/get")
    public ResponseEntity<?> register(@RequestHeader("Authorization") String bearerToken) throws Exception {
        String token = bearerToken.replace("Bearer ", "");
        ApiResponse<ConsumptionRecordResponse> response = consumptionRecordService
                .getContract(token);
        return ResponseEntity.ok(response);
    }

    /**
     * Create payment URL for a specific consumption record
     * 
     * @param consumptionRecordId - ID of the consumption record to pay
     * @param request             - HTTP request
     * @return URL to redirect to payment gateway
     */
    @GetMapping("/payment/create-url")
    public ResponseEntity<ApiResponse<String>> createPaymentUrl(
            @RequestParam Long consumptionRecordId,
            HttpServletRequest request) {
        try {
            ApiResponse<String> response = consumptionRecordService.createPaymentUrl(consumptionRecordId, request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            // Handle validation errors (record not found, already paid, etc.)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            // Handle other unexpected errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error creating payment URL: " + e.getMessage()));
        }
    }
}