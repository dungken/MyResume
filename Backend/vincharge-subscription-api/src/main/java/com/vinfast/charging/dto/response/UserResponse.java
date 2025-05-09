package com.vinfast.charging.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long user_id;
    private String username;
    private String full_name;
    private String token;
    
    // Constructor without token for registration response
    public UserResponse(Long user_id, String username, String full_name) {
        this.user_id = user_id;
        this.username = username;
        this.full_name = full_name;
    }
}
