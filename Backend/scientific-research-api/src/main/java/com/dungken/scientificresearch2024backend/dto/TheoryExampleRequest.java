package com.dungken.scientificresearch2024backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TheoryExampleRequest {
    private int exampleId;
    private int userId;
    private String answer;
    private String name;
}
