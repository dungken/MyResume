package com.dungken.scientificresearch2024backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TheoryDetailRequest {
    private int theoryDetailId;
    private int theoryCatId;
    private int userId;
    private String title;
    private String content;
}
