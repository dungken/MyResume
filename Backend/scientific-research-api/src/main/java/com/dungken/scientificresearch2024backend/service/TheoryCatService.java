package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.entity.TheoryCategory;

import java.util.List;

public interface TheoryCatService {
    public TheoryCategory addTheoryCat(TheoryCategory theoryCategory);
    public TheoryCategory updateTheoryCat(TheoryCategory theoryCategory);
    public TheoryCategory findById(int id);
    public List<TheoryCategory> findAll();
}
