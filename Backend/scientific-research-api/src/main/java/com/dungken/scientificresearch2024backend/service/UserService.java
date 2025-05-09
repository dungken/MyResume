package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    public User findByUsername(String username);
}
