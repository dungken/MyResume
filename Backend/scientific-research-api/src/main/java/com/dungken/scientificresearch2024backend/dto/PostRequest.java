package com.dungken.scientificresearch2024backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostRequest {
    private int postId;
    private String title;
    private String desc;
    private String detail;
    private String thumbnail;
    private int postCatId;
    private int userId;
}
