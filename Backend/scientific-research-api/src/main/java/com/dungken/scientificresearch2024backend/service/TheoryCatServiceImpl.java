package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.dao.TheoryCategoryRepository;
import com.dungken.scientificresearch2024backend.dao.TheoryDetailRepository;
import com.dungken.scientificresearch2024backend.entity.TheoryCategory;
import com.dungken.scientificresearch2024backend.entity.TheoryDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TheoryCatServiceImpl implements TheoryCatService{
    private TheoryCategoryRepository theoryCategoryRepository;


    @Autowired
    public TheoryCatServiceImpl(TheoryCategoryRepository theoryCategoryRepository) {
        this.theoryCategoryRepository = theoryCategoryRepository;
    }


    @Override
    public TheoryCategory addTheoryCat(TheoryCategory theoryCategory) {
        return theoryCategoryRepository.save(theoryCategory);
    }

    @Override
    public TheoryCategory updateTheoryCat(TheoryCategory theoryCategory) {
        return theoryCategoryRepository.saveAndFlush(theoryCategory);
    }

    @Override
    public TheoryCategory findById(int id) {
        return theoryCategoryRepository.findById(id).orElse(null);
    }

    @Override
    public List<TheoryCategory> findAll() {
        return theoryCategoryRepository.findAll();
    }
}
