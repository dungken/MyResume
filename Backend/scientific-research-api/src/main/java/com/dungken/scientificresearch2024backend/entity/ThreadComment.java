package com.dungken.scientificresearch2024backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
@Table(name = "thread_comment")
public class ThreadComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private int commentId;

    @Column(name = "comment_parent_id")
    private int commentParentId;

    @Column(name = "level")
    private int level;

    @Column(name = "user_id")
    private int userId;

    @Column(name = "comment", columnDefinition = "LONGTEXT")
    @Lob
    private String comment;

    @Column(name = "status")
    private boolean status;

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
    @JoinColumn(name = "thread_id", nullable = false)
    private Thread thread;
}
