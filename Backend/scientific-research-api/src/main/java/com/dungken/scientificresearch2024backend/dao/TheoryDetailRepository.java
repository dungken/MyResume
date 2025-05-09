package com.dungken.scientificresearch2024backend.dao;

import com.dungken.scientificresearch2024backend.entity.PostDetail;
import com.dungken.scientificresearch2024backend.entity.TheoryCategory;
import com.dungken.scientificresearch2024backend.entity.TheoryDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(path = "theory-detail")
public interface TheoryDetailRepository extends JpaRepository<TheoryDetail, Integer> {
    @Query("SELECT t FROM TheoryDetail t WHERE t.theoryCategory.theoryCatId = ?1")
    public Optional<TheoryDetail> findByTheoryCatId(int theoryCatId);
}
