package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.dao.TheoryCategoryRepository;
import com.dungken.scientificresearch2024backend.dao.TheoryDetailRepository;
import com.dungken.scientificresearch2024backend.dao.TheoryExampleRepository;
import com.dungken.scientificresearch2024backend.entity.TheoryCategory;
import com.dungken.scientificresearch2024backend.entity.TheoryDetail;
import com.dungken.scientificresearch2024backend.entity.TheoryExample;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TheoryExampleServiceImpl implements TheoryExampleService{
    private TheoryExampleRepository theoryCategoryRepository;
    private TheoryDetailRepository theoryDetailRepository;

    @Autowired
    public TheoryExampleServiceImpl(TheoryExampleRepository theoryCategoryRepository, TheoryDetailRepository theoryDetailRepository) {
        this.theoryCategoryRepository = theoryCategoryRepository;
        this.theoryDetailRepository = theoryDetailRepository;
    }

    @Override
    public TheoryExample addTheoryExample(TheoryExample theoryExample) {
        return theoryCategoryRepository.save(theoryExample);
    }

    @Override
    public TheoryExample updateTheoryExample(TheoryExample theoryExample) {
        return theoryCategoryRepository.saveAndFlush(theoryExample);
    }

    @Override
    public TheoryExample findById(int id) {
        return theoryCategoryRepository.findById(id).orElse(null);
    }

    @Override
    public TheoryDetail findTheoryById(int id) {
        return theoryDetailRepository.findById(id).orElse(null);
    }
}
