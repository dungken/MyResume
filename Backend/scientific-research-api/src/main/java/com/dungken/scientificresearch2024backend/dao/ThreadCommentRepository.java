package com.dungken.scientificresearch2024backend.dao;

import com.dungken.scientificresearch2024backend.entity.ThreadComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "thread-comment")
public interface ThreadCommentRepository extends JpaRepository<ThreadComment, Integer> {
}
