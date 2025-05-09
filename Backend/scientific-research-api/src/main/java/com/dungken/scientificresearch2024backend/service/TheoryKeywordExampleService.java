package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.entity.TheoryDetail;
import com.dungken.scientificresearch2024backend.entity.TheoryExample;
import com.dungken.scientificresearch2024backend.entity.TheoryKeyword;
import com.dungken.scientificresearch2024backend.entity.TheoryKeywordExample;

public interface TheoryKeywordExampleService {
    public TheoryKeywordExample addTheoryKeywordExample(TheoryKeywordExample theoryKeywordExample);
    public TheoryKeywordExample updateTheoryKeywordExample(TheoryKeywordExample theoryKeywordExample);
    public TheoryKeywordExample findById(int id);
    public TheoryExample findTheoryExampleByKeywordEqualsIgnoreCase(String keyword);
}
