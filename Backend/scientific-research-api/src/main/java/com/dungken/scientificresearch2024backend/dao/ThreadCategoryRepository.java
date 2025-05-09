package com.dungken.scientificresearch2024backend.dao;

import com.dungken.scientificresearch2024backend.entity.Thread;
import com.dungken.scientificresearch2024backend.entity.ThreadCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "thread-cat")
public interface ThreadCategoryRepository extends JpaRepository<ThreadCategory, Integer> {
}
