package com.dungken.scientificresearch2024backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThreadCategoryRequest {
    private int threadCatId;
    private String name;
    private String description;
    private int userId;
}
