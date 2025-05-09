package com.vinfast.charging.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vinfast.charging.model.PaymentTransaction;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    List<PaymentTransaction> findByConsumptionRecordId(Long consumptionRecordId);

    Optional<PaymentTransaction> findByTransactionReference(String transactionReference);

    List<PaymentTransaction> findByStatus(String status);
}