package com.dungken.scientificresearch2024backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Data
@Table(name = "theory_example")
public class TheoryExample {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "example_id")
    private int exampleId;

    @Column(name = "answer", columnDefinition = "LONGTEXT")
    @Lob
    private String answer;

    @Column(name = "`name`")
    private String name;

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

    @ManyToOne(cascade = {
            CascadeType.PERSIST, CascadeType.MERGE,
            CascadeType.REFRESH, CascadeType.DETACH
    })
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "theoryExample", fetch = FetchType.LAZY, cascade = {
            CascadeType.DETACH, CascadeType.REFRESH,
            CascadeType.PERSIST, CascadeType.MERGE,
    })
    private List<TheoryKeywordExample> theoryKeywordExamples;
}
