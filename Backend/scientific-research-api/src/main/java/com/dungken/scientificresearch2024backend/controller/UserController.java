package com.dungken.scientificresearch2024backend.controller;

import com.dungken.scientificresearch2024backend.dao.UserRepository;
import com.dungken.scientificresearch2024backend.dto.UserRequest;
import com.dungken.scientificresearch2024backend.entity.Thread;
import com.dungken.scientificresearch2024backend.entity.ThreadCategory;
import com.dungken.scientificresearch2024backend.entity.User;
import com.dungken.scientificresearch2024backend.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private AccountService accountService;
    private UserRepository userRepository;

    @Autowired
    public UserController(AccountService accountService, UserRepository userRepository) {
        this.accountService = accountService;
        this.userRepository = userRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addUser(@RequestBody UserRequest userRequest){
        return accountService.addUser(userRequest);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody UserRequest userRequest){
        return accountService.updateUser(userRequest);
    }

    @PutMapping("/update/info")
    public ResponseEntity<?> updateInfoUser(@RequestBody UserRequest userRequest){
        User userExisting = userRepository.findById(userRequest.getUserId()).orElse(null);

        if (userExisting == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        userExisting.setUserId(userRequest.getUserId());
        userExisting.setUsername(userRequest.getUsername());
        userExisting.setEmail(userRequest.getEmail());
        userExisting.setGender(userRequest.isGender());
        userExisting.setAddress(userRequest.getAddress());
        userExisting.setLastname(userRequest.getLastname());
        userExisting.setFirstname(userRequest.getFirstname());
        userExisting.setPhoneNumber(userRequest.getPhoneNumber());
        userExisting.setAvatar(userRequest.getAvatar());

        userRepository.saveAndFlush(userExisting);
        return ResponseEntity.ok("Update thread successfully!");
    }
}
