package com.dungken.scientificresearch2024backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TheoryKeywordExampleRequest {
    private int keywordExampleId;
    private int exampleId;
    private int userId;
    private String keyword;
}
