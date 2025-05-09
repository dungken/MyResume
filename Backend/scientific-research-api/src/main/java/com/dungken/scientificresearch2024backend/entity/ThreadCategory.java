package com.dungken.scientificresearch2024backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Data
@Table(name = "thread_cat")
public class ThreadCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "thread_cat_id")
    private int threadCatId;

    @Column(name = "`name`")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "`created_at`")
    private Timestamp createdAt;
    @PrePersist
    private void onCreate() {
        createdAt = new Timestamp(System.currentTimeMillis());
    }

    @Column(name = "`updated_at`")
    private Timestamp updatedAt;
    @PreUpdate
    private void onUpdate() {
        updatedAt = new Timestamp(System.currentTimeMillis());
    }

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.REFRESH, CascadeType.DETACH
    })
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "threadCategory", fetch = FetchType.LAZY, cascade = {
            CascadeType.DETACH, CascadeType.REFRESH,
            CascadeType.PERSIST, CascadeType.MERGE,
    })
    private List<Thread> thread;
}
