package com.dungken.scientificresearch2024backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Data
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int userId;

    @Column(name = "username")
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name = "active")
    private boolean active;

    @Column(name = "email")
    private String email;

    @Column(name = "gender")
    private boolean gender;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "address")
    private String address;

    @Column(name = "first_name")
    private String firstname;

    @Column(name = "last_name")
    private String lastname;

    @Column(name = "created_at")
    private Timestamp createdAt;
    @PrePersist
    private void onCreate() {
        createdAt = new Timestamp(System.currentTimeMillis());
    }

    @Column(name = "updated_at")
    private Timestamp updatedAt;
    @PreUpdate
    private void onUpdate() {
        updatedAt = new Timestamp(System.currentTimeMillis());
    }

    @Column(name = "avatar", columnDefinition = "LONGTEXT")
    @Lob
    private String avatar;

    @Column(name = "active_code")
    private String activeCode;


    @ManyToMany(fetch = FetchType.EAGER, cascade = {
            CascadeType.DETACH, CascadeType.REFRESH,
            CascadeType.PERSIST, CascadeType.MERGE,
    })
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<Role> roles;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = {
            CascadeType.DETACH, CascadeType.REFRESH,
            CascadeType.PERSIST, CascadeType.MERGE,
    })
    private List<Page> pages;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = {
            CascadeType.DETACH, CascadeType.REFRESH,
            CascadeType.PERSIST, CascadeType.MERGE,
    })
    private List<PostDetail> posts;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = {
            CascadeType.DETACH, CascadeType.REFRESH,
            CascadeType.PERSIST, CascadeType.MERGE,
    })
    private List<TheoryCategory> theoryCategories;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = {
            CascadeType.DETACH, CascadeType.REFRESH,
            CascadeType.PERSIST, CascadeType.MERGE,
    })
    private List<TheoryDetail> theoryDetails;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = {
            CascadeType.DETACH, CascadeType.REFRESH,
            CascadeType.PERSIST, CascadeType.MERGE,
    })
    private List<TheoryExample> theoryExamples;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = {
            CascadeType.DETACH, CascadeType.REFRESH,
            CascadeType.PERSIST, CascadeType.MERGE,
    })
    private List<TheoryKeyword> theoryKeywords;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = {
            CascadeType.DETACH, CascadeType.REFRESH,
            CascadeType.PERSIST, CascadeType.MERGE,
    })
    private List<ThreadCategory> threadCategories;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = {
            CascadeType.DETACH, CascadeType.REFRESH,
            CascadeType.PERSIST, CascadeType.MERGE,
    })
    private List<Thread> threads;
}
