package com.dungken.scientificresearch2024backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TheoryCategoryRequest {
    private int theoryCatId;
    private int theoryParentCatId;
    private String name;
    private String shortDesc;
    private int userId;
}
