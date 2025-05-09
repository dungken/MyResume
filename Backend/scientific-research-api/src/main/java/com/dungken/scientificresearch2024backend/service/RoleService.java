package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.entity.Role;

public interface RoleService {
    public Role addRole(Role role);
    public Role updateRole(Role role);
    public Role findByRoleId(int roleId);
}
