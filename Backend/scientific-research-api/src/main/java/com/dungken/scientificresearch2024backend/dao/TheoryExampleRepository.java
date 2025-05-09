package com.dungken.scientificresearch2024backend.dao;

import com.dungken.scientificresearch2024backend.entity.TheoryCategory;
import com.dungken.scientificresearch2024backend.entity.TheoryExample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "theory-example")
public interface TheoryExampleRepository extends JpaRepository<TheoryExample, Integer> {
}
