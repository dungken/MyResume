package com.dungken.scientificresearch2024backend.dto;

import com.dungken.scientificresearch2024backend.entity.Role;
import com.dungken.scientificresearch2024backend.entity.Thread;
import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.List;

public class UserRequest {
    private int userId;
    private String username;
    private String password;
    private String email;
    private boolean gender;
    private String phoneNumber;
    private String address;
    private String firstname;
    private String lastname;
    private String avatar;
    private List<Integer> roles;

    public UserRequest() {
    }

    public UserRequest(int userId, String username, String password, String email, boolean gender, String phoneNumber, String address, String firstname, String lastname, String avatar, List<Integer> roles) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.email = email;
        this.gender = gender;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.firstname = firstname;
        this.lastname = lastname;
        this.avatar = avatar;
        this.roles = roles;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isGender() {
        return gender;
    }

    public void setGender(boolean gender) {
        this.gender = gender;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public List<Integer> getRoles() {
        return roles;
    }

    public void setRoles(List<Integer> roles) {
        this.roles = roles;
    }

    @Override
    public String toString() {
        return "UserRequest{" +
                "userId=" + userId +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", gender=" + gender +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", address='" + address + '\'' +
                ", firstname='" + firstname + '\'' +
                ", lastname='" + lastname + '\'' +
                ", avatar='" + avatar + '\'' +
                ", roles=" + roles +
                '}';
    }
}
