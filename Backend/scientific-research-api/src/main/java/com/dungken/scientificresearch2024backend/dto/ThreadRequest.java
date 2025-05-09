package com.dungken.scientificresearch2024backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThreadRequest {
    private int threadId;
    private int userId;
    private int threadCatId;
    private String shortQuestion;
    private String detailQuestion;
    private int views;
    private int votes;
    private int replies;
    private boolean status;
}
