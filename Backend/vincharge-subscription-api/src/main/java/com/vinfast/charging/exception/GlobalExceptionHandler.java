package com.vinfast.charging.exception;

import com.vinfast.charging.dto.response.ApiResponse;
import com.vinfast.charging.service.ErrorLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import jakarta.persistence.EntityNotFoundException;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @Autowired
    private ErrorLogService errorLogService;

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        // Log the validation error
        String requestURI = request.getDescription(false).replace("uri=", "");
        // Add a prefix to help identify the validation errors
        errorLogService.logError(requestURI, "Validation error: " + errors.toString());
        
        ApiResponse<Map<String, String>> response = new ApiResponse<>("error", "Validation failed", errors);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleEntityNotFoundException(
            EntityNotFoundException ex,
            WebRequest request) {
        
        // Log the entity not found error
        String requestURI = request.getDescription(false).replace("uri=", "");
        errorLogService.logError(requestURI, "Entity not found: " + ex.getMessage());
        
        ApiResponse<?> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGlobalException(
            Exception ex,
            WebRequest request) {
        
        // Log the general exception
        String requestURI = request.getDescription(false).replace("uri=", "");
        errorLogService.logError(ex, requestURI);
        
        // For security reasons, don't expose the actual error details to the client in production
        String clientMessage = "An unexpected error occurred. Our team has been notified.";
        if (isDevelopmentProfile()) {
            // In development, include the actual error message for debugging
            clientMessage = "An unexpected error occurred: " + ex.getMessage();
        }
        
        ApiResponse<?> response = ApiResponse.error(clientMessage);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    /**
     * Check if the application is running in development profile
     * This method can be implemented based on your configuration properties
     * @return true if running in development mode
     */
    private boolean isDevelopmentProfile() {
        // This is a placeholder - you should implement this based on your project configuration
        // For example, you might use @Value annotation to inject a property from application.properties
        // @Value("${spring.profiles.active:}")
        // private String activeProfile;
        // return "dev".equals(activeProfile) || "local".equals(activeProfile);
        
        // For now, we'll just return true as a dummy implementation
        return true;
    }
}
