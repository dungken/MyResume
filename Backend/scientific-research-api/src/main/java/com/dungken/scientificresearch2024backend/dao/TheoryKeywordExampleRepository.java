package com.dungken.scientificresearch2024backend.dao;

import com.dungken.scientificresearch2024backend.entity.TheoryDetail;
import com.dungken.scientificresearch2024backend.entity.TheoryExample;
import com.dungken.scientificresearch2024backend.entity.TheoryKeyword;
import com.dungken.scientificresearch2024backend.entity.TheoryKeywordExample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(path = "theory-keyword-example")
public interface TheoryKeywordExampleRepository extends JpaRepository<TheoryKeywordExample, Integer> {
    @Query("select tke.theoryExample from TheoryKeywordExample tke where tke.keyword = ?1")
    public Optional<TheoryExample> findTheoryExampleByKeywordEqualsIgnoreCase(String keyword);
}
