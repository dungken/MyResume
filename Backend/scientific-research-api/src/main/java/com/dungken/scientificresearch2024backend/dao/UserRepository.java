package com.dungken.scientificresearch2024backend.dao;

import com.dungken.scientificresearch2024backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(path = "user")
public interface UserRepository extends JpaRepository<User, Integer> {
    public User findByUserId(int id);
    public User findByUsername(String username);
    public User findByEmail(String email);
    public boolean existsByUsername(String username);
    public boolean existsByEmail(String email);
    public List<User> findByUsernameContaining(String username);
}
