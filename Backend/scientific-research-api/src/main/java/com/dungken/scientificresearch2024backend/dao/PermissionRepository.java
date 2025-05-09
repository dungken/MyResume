package com.dungken.scientificresearch2024backend.dao;

import com.dungken.scientificresearch2024backend.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "permission")
public interface PermissionRepository extends JpaRepository<Permission, Integer> {
}
