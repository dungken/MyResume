package com.vinfast.charging.controller;

import com.vinfast.charging.dto.response.ApiResponse;
import com.vinfast.charging.model.ErrorLog;
import com.vinfast.charging.repository.ErrorLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/error-logs")
public class ErrorLogController {

    @Autowired
    private ErrorLogRepository errorLogRepository;
    
    @Value("${application.error-log.retention-days:90}")
    private int defaultRetentionDays;

    /**
     * Get paginated error logs with sorting and filtering options
     * This endpoint is only accessible to administrators
     * 
     * @param page page number (0-based)
     * @param size page size
     * @param sortBy field to sort by (uses camelCase property names)
     * @param direction sort direction (ASC or DESC)
     * @param errorCode filter by error code
     * @param errorApi filter by API endpoint
     * @param startDate filter errors after this date
     * @param endDate filter errors before this date
     * @return paginated list of error logs
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getErrorLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction,
            @RequestParam(required = false) String errorCode,
            @RequestParam(required = false) String errorApi,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        // Create sorting
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        
        // Use the custom repository method with filters
        Page<ErrorLog> errorLogs = errorLogRepository.findWithFilters(
                errorCode, errorApi, startDate, endDate, pageRequest);
        
        Map<String, Object> response = new HashMap<>();
        response.put("errors", errorLogs.getContent());
        response.put("currentPage", errorLogs.getNumber());
        response.put("totalItems", errorLogs.getTotalElements());
        response.put("totalPages", errorLogs.getTotalPages());
        
        return ResponseEntity.ok(ApiResponse.success("Error logs retrieved successfully", response));
    }

    /**
     * Get a specific error log by ID
     * 
     * @param id the error log ID
     * @return the error log details
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getErrorLogById(@PathVariable Long id) {
        return errorLogRepository.findById(id)
                .map(errorLog -> ResponseEntity.ok(ApiResponse.success("Error log retrieved successfully", errorLog)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete an error log (for cleanup purposes)
     * 
     * @param id the error log ID to delete
     * @return success response
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteErrorLog(@PathVariable Long id) {
        if (errorLogRepository.existsById(id)) {
            errorLogRepository.deleteById(id);
            return ResponseEntity.ok(ApiResponse.success("Error log deleted successfully", null));
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Cleanup error logs older than the specified number of days
     * If no days parameter is provided, uses the configured default retention period
     * 
     * @param days number of days to keep logs for (optional)
     * @return success response with count of deleted logs
     */
    @DeleteMapping("/cleanup")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> cleanupErrorLogs(
            @RequestParam(required = false) Integer days) {
        
        // Use specified days or fall back to configured default
        int retentionDays = (days != null) ? days : defaultRetentionDays;
        
        // Calculate the date threshold
        LocalDateTime threshold = LocalDateTime.now().minusDays(retentionDays);
        
        // Delete logs older than the threshold
        int deletedCount = errorLogRepository.deleteByCreatedDateBefore(threshold);
        
        Map<String, Object> response = new HashMap<>();
        response.put("deletedCount", deletedCount);
        response.put("retentionDays", retentionDays);
        response.put("thresholdDate", threshold);
        
        return ResponseEntity.ok(ApiResponse.success(
                String.format("Successfully deleted %d error logs older than %d days", deletedCount, retentionDays),
                response));
    }
}
