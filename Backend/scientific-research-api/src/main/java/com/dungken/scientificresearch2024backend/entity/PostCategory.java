package com.dungken.scientificresearch2024backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Data
@Table(name = "post_cat")
public class PostCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_cat_id")
    private int postCatId;

    @Column(name = "post_cat_parent_id")
    private int postCatParentId;

    @Column(name = "post_cat_name")
    private String postCatName;
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

    @Column(name = "`desc`")
    private String desc;

    @OneToMany(mappedBy = "postCategory", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<PostDetail> posts;
}
