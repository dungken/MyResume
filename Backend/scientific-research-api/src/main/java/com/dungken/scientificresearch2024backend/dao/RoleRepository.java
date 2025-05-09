package com.dungken.scientificresearch2024backend.dao;

import com.dungken.scientificresearch2024backend.entity.Role;
import com.dungken.scientificresearch2024backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "role")
public interface RoleRepository extends JpaRepository<Role, Integer> {
}
