package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.dao.RoleRepository;
import com.dungken.scientificresearch2024backend.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleServiceImpl implements RoleService{
    private RoleRepository roleRepository;

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public Role addRole(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public Role updateRole(Role role) {
        return roleRepository.saveAndFlush(role);
    }

    @Override
    public Role findByRoleId(int roleId) {
        return roleRepository.findById(roleId).orElse(null);
    }
}
