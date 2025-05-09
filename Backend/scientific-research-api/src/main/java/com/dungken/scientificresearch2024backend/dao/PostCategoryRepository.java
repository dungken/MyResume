package com.dungken.scientificresearch2024backend.dao;

import com.dungken.scientificresearch2024backend.entity.PostCategory;
import com.dungken.scientificresearch2024backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "post-cat")
public interface PostCategoryRepository extends JpaRepository<PostCategory, Integer> {
}
