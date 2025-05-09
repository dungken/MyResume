package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.entity.TheoryDetail;
import com.dungken.scientificresearch2024backend.entity.TheoryKeyword;

import java.util.Optional;

public interface TheoryKeywordService {
    public TheoryKeyword addTheoryKeyword(TheoryKeyword theoryKeyword);
    public TheoryKeyword updateTheoryKeyword(TheoryKeyword theoryKeyword);
    public TheoryKeyword findById(int id);
    public TheoryDetail findTheoryDetailByKeywordEqualsIgnoreCase(String keyword);
}
