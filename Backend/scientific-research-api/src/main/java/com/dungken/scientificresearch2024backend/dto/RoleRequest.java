package com.dungken.scientificresearch2024backend.dto;

import com.dungken.scientificresearch2024backend.entity.Permission;

import java.util.List;

public class RoleRequest {
    private int roleId;
    private String roleName;
    private String desc;
    private List<Integer> permissions;

    public RoleRequest() {
    }

    public RoleRequest(String roleName, String desc, List<Integer> permissions) {
        this.roleName = roleName;
        this.desc = desc;
        this.permissions = permissions;
    }

    public int getRoleId() {
        return roleId;
    }

    public void setRoleId(int roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public List<Integer> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<Integer> permissions) {
        this.permissions = permissions;
    }

    @Override
    public String toString() {
        return "RoleRequest{" +
                "roleId=" + roleId +
                ", roleName='" + roleName + '\'' +
                ", desc='" + desc + '\'' +
                ", permissions=" + permissions +
                '}';
    }
}
