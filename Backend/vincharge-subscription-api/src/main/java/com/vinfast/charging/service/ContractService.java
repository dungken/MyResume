package com.vinfast.charging.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.vinfast.charging.dto.request.AddConsumptionRecordRequest;
import com.vinfast.charging.dto.response.ApiResponse;
import com.vinfast.charging.dto.response.ConsumptionRecordResponse;
import com.vinfast.charging.dto.response.ImageUploadResponse;
import com.vinfast.charging.model.ConsumptionRecord;
import com.vinfast.charging.model.ConsumptionRecordDetail;
import com.vinfast.charging.model.Contract;
import com.vinfast.charging.repository.ConsumptionRecordDetailRepository;
import com.vinfast.charging.repository.ConsumptionRecordRepository;
import com.vinfast.charging.repository.ContractRepository;
import com.vinfast.charging.repository.UnitPriceRepository;
import com.vinfast.charging.repository.UserRepository;
import com.vinfast.charging.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class ContractService {

        @Autowired
        private ContractRepository contractRepository;
        @Autowired
        private ConsumptionRecordRepository consumptionRecordRepository;
        @Autowired
        private ConsumptionRecordDetailRepository consumptionRecordDetailRepository;
        @Autowired
        private UnitPriceRepository unitPriceRepository;
        @Autowired
        private ImageUploadService imageUploadService;
        @Autowired
        private UserRepository userRepository;
        @Autowired
        private JwtUtil jwtUtil;
        @Autowired
        private ErrorLogService errorLogService;
        @Autowired
        private PaymentService paymentService;

        @Transactional
        public ApiResponse<?> addConsumptionRecord(AddConsumptionRecordRequest request, MultipartFile solarImg,
                        MultipartFile evnImg, MultipartFile vinfastImg) throws Exception {
                Optional<Contract> contractOpt = contractRepository.findById(request.getContractId());
                if (contractOpt.isEmpty()) {
                        return ApiResponse.error("Contract not found.");
                }
                try {
                        // Upload image URLs
                        CompletableFuture<ImageUploadResponse> solarFuture = imageUploadService.uploadImageAsync(null,
                                        solarImg);
                        CompletableFuture<ImageUploadResponse> evnFuture = imageUploadService.uploadImageAsync(null,
                                        evnImg);
                        CompletableFuture<ImageUploadResponse> vinfastFuture = imageUploadService.uploadImageAsync(null,
                                        vinfastImg);
                        CompletableFuture.allOf(solarFuture, evnFuture, vinfastFuture).join();
                        ImageUploadResponse solarUrlImg = solarFuture.get(30, TimeUnit.SECONDS);
                        ImageUploadResponse evnUrlImg = evnFuture.get(30, TimeUnit.SECONDS);
                        ImageUploadResponse vinfastUrlImg = vinfastFuture.get(30, TimeUnit.SECONDS);

                        Double pricePerKwh = unitPriceRepository.findLatestPricePerKwh();

                        if (pricePerKwh == null) {
                                return ApiResponse.error("Price per kwh not found.");
                        }

                        BigDecimal incomeMonth = BigDecimal
                                        .valueOf((request.getVinfastKwh() - request.getEvnKwh()) * pricePerKwh)
                                        .setScale(0, RoundingMode.HALF_UP);
                        Contract contract = contractOpt.get();

                        Optional<ConsumptionRecord> oldRecordOpt = consumptionRecordRepository
                                        .findTopByContractIdOrderByCreatedDateDesc(request.getContractId());

                        BigDecimal totalIncome = oldRecordOpt.map(r -> incomeMonth.add(r.getTotalIncome()))
                                        .orElse(incomeMonth);
                        BigDecimal balance = contract.getLimitAmount().subtract(totalIncome);

                        // Save record
                        ConsumptionRecord newRecord = new ConsumptionRecord(
                                        request.getContractId(), incomeMonth, totalIncome, balance, false, pricePerKwh);
                        Long recordId = consumptionRecordRepository.save(newRecord).getConsumptionRecordId();

                        // Save details
                        List<ConsumptionRecordDetail> recordDetails = List.of(
                                        new ConsumptionRecordDetail(recordId, request.getSolarKwh(),
                                                        solarUrlImg.getSecureUrl(), 1, solarUrlImg.getPublicId()),
                                        new ConsumptionRecordDetail(recordId, request.getEvnKwh(),
                                                        evnUrlImg.getSecureUrl(), 2, evnUrlImg.getPublicId()),
                                        new ConsumptionRecordDetail(recordId, request.getVinfastKwh(),
                                                        vinfastUrlImg.getSecureUrl(), 3, vinfastUrlImg.getPublicId()));
                        consumptionRecordDetailRepository.saveAll(recordDetails);

                        return ApiResponse.success("Add consumption record success");
                } catch (Exception e) {
                        throw new Exception("Fail to save consumption record info. " +
                                        errorLogService.logError("/api/contract/consumption/add-record", e.toString()));
                }
        }

        public ApiResponse<ConsumptionRecordResponse> getContract(String token) throws Exception {
                try {
                        String username = jwtUtil.extractUsername(token);
                        String phone = userRepository.findPhoneByUsername(username).get();
                        Optional<Contract> contractInfo = contractRepository
                                        .findTopByPhoneAndIsActiveTrueOrderByCreatedDateDesc(phone);
                        if (contractInfo.isPresent()) {
                                Contract contract = contractInfo.get();
                                Optional<ConsumptionRecord> oldRecordOpt = consumptionRecordRepository
                                                .findTopByContractIdOrderByCreatedDateDesc(contract.getContractId());
                                if (oldRecordOpt.isEmpty()) {
                                        return ApiResponse.error(
                                                        "No consumption record found for contractId: "
                                                                        + contract.getContractId());
                                }
                                ConsumptionRecord record = oldRecordOpt.get();
                                List<ConsumptionRecordDetail> details = consumptionRecordDetailRepository
                                                .findByConsumptionRecordId(record.getConsumptionRecordId());
                                ConsumptionRecordResponse response = new ConsumptionRecordResponse(
                                                contract.getContractCode(), contract.getLimitAmount(),
                                                record.getConsumptionRecordId(), record.getContractId(),
                                                record.getIncomeMonth(), record.getTotalIncome(),
                                                record.getBalance(), record.getIsPaid(),
                                                record.getCreatedDate(), record.getPricePerKwh(), details);
                                return ApiResponse.success("Get success", response);
                        } else {
                                return ApiResponse.success("Not have a contract yet");
                        }

                } catch (Exception e) {
                        throw new Exception("Fail to get contract info. " +
                                        errorLogService.logError("/api/contract/get", e.toString()));
                }
        }

        @Transactional
        public ApiResponse<?> updateConsumptionRecord(AddConsumptionRecordRequest request, MultipartFile solarImg,
                        MultipartFile evnImg, MultipartFile vinfastImg) throws Exception {
                Optional<Contract> contractOpt = contractRepository.findById(request.getContractId());
                if (contractOpt.isEmpty()) {
                        return ApiResponse.error("Contract not found.");
                }
                Contract contract = contractOpt.get();
                List<ConsumptionRecord> oldRecords = consumptionRecordRepository
                                .findTop2ByContractIdOrderByCreatedDateDesc(contract.getContractId());
                List<ConsumptionRecordDetail> recordDetails = consumptionRecordDetailRepository
                                .findByConsumptionRecordId(oldRecords.get(0).getConsumptionRecordId());
                if (recordDetails.size() != 3) {
                        return ApiResponse.error(
                                        "No consumption record detail found for: "
                                                        + oldRecords.get(0).getConsumptionRecordId());
                }
                try {
                        Double pricePerKwh = unitPriceRepository.findLatestPricePerKwh();
                        if (pricePerKwh == null) {
                                return ApiResponse.error("Price per kwh not found.");
                        }

                        BigDecimal incomeMonth = BigDecimal
                                        .valueOf((request.getVinfastKwh() - request.getEvnKwh()) * pricePerKwh)
                                        .setScale(0, RoundingMode.HALF_UP);
                        BigDecimal totalIncome = oldRecords.size() == 1 ? incomeMonth
                                        : oldRecords.get(1).getTotalIncome().add(incomeMonth);
                        BigDecimal balance = contract.getLimitAmount().subtract(totalIncome);

                        oldRecords.get(0).setIncomeMonth(incomeMonth);
                        oldRecords.get(0).setTotalIncome(totalIncome);
                        oldRecords.get(0).setBalance(balance);
                        oldRecords.get(0).setIsPaid(true);
                        oldRecords.get(0).setPricePerKwh(pricePerKwh);

                        CompletableFuture<ImageUploadResponse> solarFuture = imageUploadService.uploadImageAsync(
                                        recordDetails.stream()
                                                        .filter(c -> c.getType() == 1).findFirst().get().getImageId(),
                                        solarImg);
                        CompletableFuture<ImageUploadResponse> evnFuture = imageUploadService.uploadImageAsync(
                                        recordDetails.stream()
                                                        .filter(c -> c.getType() == 2).findFirst().get().getImageId(),
                                        evnImg);
                        CompletableFuture<ImageUploadResponse> vinfastFuture = imageUploadService.uploadImageAsync(
                                        recordDetails.stream()
                                                        .filter(c -> c.getType() == 3).findFirst().get().getImageId(),
                                        vinfastImg);
                        CompletableFuture.allOf(solarFuture, evnFuture, vinfastFuture).join();
                        ImageUploadResponse solarUrlImg = solarFuture.get(30, TimeUnit.SECONDS);
                        ImageUploadResponse evnUrlImg = evnFuture.get(30, TimeUnit.SECONDS);
                        ImageUploadResponse vinfastUrlImg = vinfastFuture.get(30, TimeUnit.SECONDS);
                        recordDetails.forEach(r -> {
                                if (r.getType() == 1) {
                                        r.setImageUrl(solarUrlImg.getSecureUrl());
                                        r.setImageId(solarUrlImg.getPublicId());
                                        r.setKwhNumber(request.getSolarKwh());
                                } else if (r.getType() == 2) {
                                        r.setImageUrl(evnUrlImg.getSecureUrl());
                                        r.setImageId(evnUrlImg.getPublicId());
                                        r.setKwhNumber(request.getEvnKwh());
                                } else {
                                        r.setImageUrl(vinfastUrlImg.getSecureUrl());
                                        r.setImageId(vinfastUrlImg.getPublicId());
                                        r.setKwhNumber(request.getVinfastKwh());
                                }
                        });

                        consumptionRecordRepository.save(oldRecords.get(0));
                        consumptionRecordDetailRepository.saveAll(recordDetails);

                        return ApiResponse.success("Updated success");
                } catch (Exception e) {
                        throw new Exception("Fail to update consumption record. " +
                                        errorLogService.logError("/api/contract/consumtion/update-record",
                                                        e.toString()));
                }
        }

        /**
         * Create payment URL for a specific consumption record
         * 
         * @param consumptionRecordId - ID of the consumption record to pay
         * @param request             - HTTP request
         * @return URL to redirect to payment gateway
         */
        public ApiResponse<String> createPaymentUrl(Long consumptionRecordId, HttpServletRequest request)
                        throws Exception {
                try {
                        Optional<ConsumptionRecord> recordOpt = consumptionRecordRepository
                                        .findById(consumptionRecordId);

                        if (recordOpt.isEmpty()) {
                                throw new IllegalArgumentException(
                                                "Consumption record not found: " + consumptionRecordId);
                        }

                        ConsumptionRecord record = recordOpt.get();

                        // Check if already paid
                        if (record.getIsPaid()) {
                                throw new IllegalArgumentException("This record is already paid");
                        }

                        // Use the income month value as the payment amount
                        BigDecimal amount = record.getIncomeMonth();

                        String orderInfo = "Thanh toan tien dien VinCharge #" + consumptionRecordId;
                        String paymentUrl = paymentService.createPaymentUrl(amount, orderInfo, consumptionRecordId,
                                        request);

                        return ApiResponse.success("Payment URL created", paymentUrl);
                } catch (Exception e) {
                        throw new Exception("Failed to create payment URL: " +
                                        errorLogService.logError("/api/contract/payment/create-url", e.toString()));
                }
        }
}