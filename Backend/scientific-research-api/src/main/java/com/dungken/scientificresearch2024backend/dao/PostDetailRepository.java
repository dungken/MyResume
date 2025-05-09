package com.dungken.scientificresearch2024backend.dao;

import com.dungken.scientificresearch2024backend.entity.PostDetail;
import com.dungken.scientificresearch2024backend.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "post-detail")
public interface PostDetailRepository extends JpaRepository<PostDetail, Integer> {
}
