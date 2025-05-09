package com.dungken.scientificresearch2024backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ThreadCommentRequest {
    private int commentId;
    private int commentParentId;
    private int level;
    private int userId;
    private int threadId;
    private String comment;
    private boolean status;
}
