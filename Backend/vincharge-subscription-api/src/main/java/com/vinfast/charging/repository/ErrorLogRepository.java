package com.vinfast.charging.repository;

import com.vinfast.charging.model.ErrorLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ErrorLogRepository extends JpaRepository<ErrorLog, Long> {
    
    /**
     * Find error logs by error code
     * @param errorCode the error code to search for
     * @return list of matching error logs
     */
    List<ErrorLog> findByErrorCode(String errorCode);
    
    /**
     * Find error logs by API endpoint
     * @param errorApi the API endpoint to search for
     * @return list of matching error logs
     */
    List<ErrorLog> findByErrorApi(String errorApi);
    
    /**
     * Find error logs created between two dates
     * @param startDate the start date (inclusive)
     * @param endDate the end date (inclusive)
     * @param pageable pagination information
     * @return page of matching error logs
     */
    Page<ErrorLog> findByCreatedDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    /**
     * Delete error logs older than a specified date
     * @param date the cutoff date
     * @return the number of deleted records
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM ErrorLog e WHERE e.createdDate < :date")
    int deleteByCreatedDateBefore(@Param("date") LocalDateTime date);
    
    /**
     * Custom query combining multiple filter criteria
     * @param errorCode error code filter (optional)
     * @param errorApi API endpoint filter (optional)
     * @param startDate start date filter (optional)
     * @param endDate end date filter (optional) 
     * @param pageable pagination information
     * @return page of matching error logs
     */
    @Query("SELECT e FROM ErrorLog e WHERE " +
           "(:errorCode IS NULL OR e.errorCode = :errorCode) AND " +
           "(:errorApi IS NULL OR e.errorApi LIKE %:errorApi%) AND " +
           "(:startDate IS NULL OR e.createdDate >= :startDate) AND " +
           "(:endDate IS NULL OR e.createdDate <= :endDate)")
    Page<ErrorLog> findWithFilters(
            @Param("errorCode") String errorCode,
            @Param("errorApi") String errorApi,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);
}