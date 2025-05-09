package com.dungken.scientificresearch2024backend.controller;

import com.dungken.scientificresearch2024backend.dao.PermissionRepository;
import com.dungken.scientificresearch2024backend.dto.RoleRequest;
import com.dungken.scientificresearch2024backend.entity.Permission;
import com.dungken.scientificresearch2024backend.entity.Role;
import com.dungken.scientificresearch2024backend.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/role/")
public class RoleController {
    private RoleService roleService;

    private PermissionRepository permissionRepository;

    @Autowired
    public RoleController(RoleService roleService, PermissionRepository permissionRepository) {
        this.roleService = roleService;
        this.permissionRepository = permissionRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addRole(@RequestBody RoleRequest roleRequest) {
        Role role = new Role();
        role.setRoleName(roleRequest.getRoleName());
        role.setDesc(roleRequest.getDesc());

        // Lấy danh sách quyền từ danh sách các permissionId
        List<Permission> permissions = new ArrayList<>();
        for (Integer permissionId : roleRequest.getPermissions()) {
            Permission permission = permissionRepository.findById(permissionId).orElse(null);
            if (permission != null) {
                permissions.add(permission);
            }
        }
        role.setPermissions(permissions);

        Role savedRole = roleService.addRole(role);
        return ResponseEntity.ok(savedRole);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateRole(@RequestBody RoleRequest roleRequest) {
        // Lấy đối tượng Role hiện có từ cơ sở dữ liệu
        Role role = roleService.findByRoleId(roleRequest.getRoleId());

        if (role == null) {
            // Trả về lỗi nếu không tìm thấy role với id cung cấp
            return ResponseEntity.notFound().build();
        }

        // Cập nhật các thuộc tính của role từ roleRequest
        role.setRoleName(roleRequest.getRoleName());
        role.setDesc(roleRequest.getDesc());

        // Lấy danh sách quyền từ danh sách các permissionId
        List<Permission> permissions = new ArrayList<>();
        for (Integer permissionId : roleRequest.getPermissions()) {
            Permission permission = permissionRepository.findById(permissionId).orElse(null);
            if (permission != null) {
                permissions.add(permission);
            }
        }
        role.setPermissions(permissions);

        // Cập nhật role trong cơ sở dữ liệu
        Role updatedRole = roleService.updateRole(role);
        return ResponseEntity.ok(updatedRole);
    }
}
