package com.dungken.scientificresearch2024backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TheoryKeywordRequest {
    private int keywordId;
    private int theoryDetailId;
    private int userId;
    private String keyword;
}
