package com.vinfast.charging.service;

import com.vinfast.charging.model.ErrorLog;
import com.vinfast.charging.repository.ErrorLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ErrorLogService {

    private static final Logger logger = LoggerFactory.getLogger(ErrorLogService.class);

    @Autowired
    private ErrorLogRepository errorLogRepository;

    /**
     * Log an error with specific error code, API endpoint, and reason
     * 
     * @param errorCode   the error code (limited to 10 characters)
     * @param errorApi    the API endpoint where the error occurred (limited to 20
     *                    characters)
     * @param errorReason the reason for the error (limited to 225 characters)
     */
    public String logError(String errorApi, String errorReason) {
        try {
            // Truncate values if they exceed column length
            if (errorApi != null && errorApi.length() > 20) {
                errorApi = errorApi.substring(0, 20);
            }

            if (errorReason != null && errorReason.length() > 225) {
                errorReason = errorReason.substring(0, 222) + "...";
            }
            String errorCode = this.generateCode();
            ErrorLog errorLog = new ErrorLog(errorCode, errorApi, errorReason);
            errorLogRepository.save(errorLog);

            // Log to console as well for monitoring
            logger.error("Error logged - Code: {}, API: {}, Reason: {}", errorCode, errorApi, errorReason);
            return errorCode;
        } catch (Exception e) {
            // Failsafe logging to console if database logging fails
            logger.error("Failed to log error to database: {}", e.getMessage(), e);
            return "FAIL";
        }
    }

    /**
     * Log an error from an exception with the API endpoint
     * 
     * @param ex       the exception that occurred
     * @param errorApi the API endpoint where the error occurred
     */
    public void logError(Exception ex, String errorApi) {
        try {
            String errorCode = "ERR";
            String errorReason = ex.getMessage();
            if (errorReason == null || errorReason.isEmpty()) {
                errorReason = ex.getClass().getSimpleName();
            }

            // Get stack trace for more detailed logging
            String stackTrace = getStackTraceAsString(ex);
            if (stackTrace.length() > 225) {
                stackTrace = stackTrace.substring(0, 222) + "...";
            }

            // First log the basic error message
            ErrorLog errorLog = new ErrorLog(errorCode, errorApi, errorReason);
            errorLogRepository.save(errorLog);

            // Then log the stack trace with the same code but different reason
            if (!errorReason.equals(stackTrace)) {
                ErrorLog stackTraceLog = new ErrorLog(errorCode + "_ST", errorApi, stackTrace);
                errorLogRepository.save(stackTraceLog);
            }

            // Log to console as well
            logger.error("Exception logged - API: {}, Message: {}", errorApi, errorReason, ex);
        } catch (Exception e) {
            // Failsafe logging to console if database logging fails
            logger.error("Failed to log exception to database: {}", e.getMessage(), e);
            logger.error("Original exception: {}", ex.getMessage(), ex);
        }
    }

    /**
     * Convert a stack trace to a string representation
     * 
     * @param ex the exception with the stack trace
     * @return the stack trace as a string
     */
    private String getStackTraceAsString(Exception ex) {
        StringBuilder sb = new StringBuilder();
        sb.append(ex.toString()).append("\n");

        StackTraceElement[] stackTrace = ex.getStackTrace();
        // Include just the first few elements to avoid extremely long strings
        int elementsToInclude = Math.min(5, stackTrace.length);

        for (int i = 0; i < elementsToInclude; i++) {
            sb.append("\tat ").append(stackTrace[i]).append("\n");
        }

        if (stackTrace.length > elementsToInclude) {
            sb.append("\t... ").append(stackTrace.length - elementsToInclude).append(" more");
        }

        return sb.toString();
    }

    private String generateCode() {
        return java.util.UUID.randomUUID().toString().replaceAll("-", "")
                .toUpperCase().substring(0, 10);
    }

}