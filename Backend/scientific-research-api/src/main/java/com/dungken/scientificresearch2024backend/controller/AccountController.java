package com.dungken.scientificresearch2024backend.controller;

import com.dungken.scientificresearch2024backend.entity.User;
import com.dungken.scientificresearch2024backend.security.JwtResponse;
import com.dungken.scientificresearch2024backend.security.LoginRequest;
import com.dungken.scientificresearch2024backend.service.AccountService;
import com.dungken.scientificresearch2024backend.service.JwtService;
import com.dungken.scientificresearch2024backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/account")
public class AccountController {
    @Autowired
    private AccountService accountService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;

//    @PostMapping("/register")
//    public ResponseEntity<?> registerUser(@Validated @RequestBody User user){
//        ResponseEntity<?> response = accountService.registerUser(user);
//        return response;
//    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@Validated @RequestBody User user){
        ResponseEntity<?> response = accountService.updateUser(user);
        return response;
    }

    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassUser(@Validated @RequestBody User user){
        ResponseEntity<?> response = accountService.resetPassUser(user);
        return response;
    }

    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(@Validated @RequestBody User user){
        ResponseEntity<?> response = accountService.updatePassword(user);
        return response;
    }

    @GetMapping("/reset-pass")
    public ResponseEntity<?> resetPass(@RequestParam String email, @RequestParam String activeCode){
        ResponseEntity<?> response = accountService.resetPasswordAccount(email, activeCode);
        return response;
    }


    @GetMapping("/active")
    public ResponseEntity<?> activeAccount(@RequestParam String email, @RequestParam String activeCode){
        ResponseEntity<?> response = accountService.activeAccount(email, activeCode);
        return response;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){
        // Xác thực người dùng bằng tên đăng nhập và mật khẩu
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            // Nếu xác thực thành công, tạo token JWT
            if(authentication.isAuthenticated()){
                final String jwt = jwtService.generateToken(loginRequest.getUsername());
                return ResponseEntity.ok(new JwtResponse(jwt));
            }
        }catch (AuthenticationException e){
            // Xác thực không thành công, trả về lỗi hoặc thông báo
            return ResponseEntity.badRequest().body("Username or password is incorrect.");
        }
        return ResponseEntity.badRequest().body("Authentication failed.");
    }
}