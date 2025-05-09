package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.entity.TheoryCategory;
import com.dungken.scientificresearch2024backend.entity.TheoryDetail;
import com.dungken.scientificresearch2024backend.entity.TheoryExample;

public interface TheoryExampleService {
    public TheoryExample addTheoryExample(TheoryExample theoryExample);
    public TheoryExample updateTheoryExample(TheoryExample theoryExample);
    public TheoryExample findById(int id);
    public TheoryDetail findTheoryById(int id);
}
