package com.dungken.scientificresearch2024backend.dao;

import com.dungken.scientificresearch2024backend.entity.TheoryDetail;
import com.dungken.scientificresearch2024backend.entity.TheoryExample;
import com.dungken.scientificresearch2024backend.entity.TheoryKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(path = "theory-keyword")
public interface TheoryKeywordRepository extends JpaRepository<TheoryKeyword, Integer> {
    @Query("select tk.theoryDetail from TheoryKeyword tk where tk.keyword = ?1")
    public Optional<TheoryDetail> findTheoryDetailByKeywordEqualsIgnoreCase(String keyword);
}
