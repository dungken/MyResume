package com.vinfast.charging.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vinfast.charging.model.Contract;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {

    Optional<Contract> findTopByPhoneAndIsActiveTrueOrderByCreatedDateDesc(String phone);
}
