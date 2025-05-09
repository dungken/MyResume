package com.vinfast.charging.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import com.vinfast.charging.repository.ErrorLogRepository;

import java.time.LocalDateTime;

@Configuration
@EnableScheduling
public class SchedulingConfig {

    private static final Logger logger = LoggerFactory.getLogger(SchedulingConfig.class);
    
    @Autowired
    private ErrorLogRepository errorLogRepository;

    @Value("${application.error-log.retention-days:90}")
    private int retentionDays;
    
    /**
     * Cleanup error logs older than the configured retention period
     * Runs according to the schedule configured in application.properties
     */
    @Scheduled(cron = "${application.error-log.cleanup-cron:0 0 2 1 * ?}")
    public void cleanupErrorLogs() {
        try {
            // Calculate the date threshold based on configured retention days
            LocalDateTime retentionThreshold = LocalDateTime.now().minusDays(retentionDays);
            
            // Delete all error logs older than the threshold
            int deletedCount = errorLogRepository.deleteByCreatedDateBefore(retentionThreshold);
            
            logger.info("Scheduled cleanup task completed: {} error logs deleted (older than {} days)",
                    deletedCount, retentionDays);
        } catch (Exception e) {
            logger.error("Error during scheduled error log cleanup", e);
        }
    }
}
