package com.dungken.scientificresearch2024backend.dao;

import com.dungken.scientificresearch2024backend.entity.TheoryCategory;
import com.dungken.scientificresearch2024backend.entity.TheoryDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "theory-cat")
public interface TheoryCategoryRepository extends JpaRepository<TheoryCategory, Integer> {
}
