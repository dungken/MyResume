package com.dungken.scientificresearch2024backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;
@Entity
@Data
@Table(name = "thread")
public class Thread {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "thread_id")
    private int threadId;

    @Column(name = "replies")
    private int replies;

    @Column(name = "views")
    private int views;

    @Column(name = "votes")
    private int votes;

    @Column(name = "status")
    private boolean status;

    @Column(name = "short_question")
    private String shortQuestion;

    @Column(name = "detail_question", columnDefinition = "LONGTEXT")
    @Lob
    private String detailQuestion;

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

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.REFRESH, CascadeType.DETACH
    })
    @JoinColumn(name = "thread_cat_id", nullable = false)
    private ThreadCategory threadCategory;

    @OneToMany(mappedBy = "thread", fetch = FetchType.LAZY, cascade = {
            CascadeType.DETACH, CascadeType.REFRESH,
            CascadeType.PERSIST, CascadeType.MERGE,
    })
    private List<ThreadComment> threadComments;
}
