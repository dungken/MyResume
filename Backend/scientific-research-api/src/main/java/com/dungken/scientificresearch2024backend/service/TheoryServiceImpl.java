package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.dao.PostDetailRepository;
import com.dungken.scientificresearch2024backend.dao.TheoryCategoryRepository;
import com.dungken.scientificresearch2024backend.dao.TheoryDetailRepository;
import com.dungken.scientificresearch2024backend.entity.PostDetail;
import com.dungken.scientificresearch2024backend.entity.TheoryCategory;
import com.dungken.scientificresearch2024backend.entity.TheoryDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TheoryServiceImpl implements TheoryService{
    private TheoryDetailRepository theoryDetailRepository;
    private TheoryCategoryRepository theoryCategoryRepository;

    @Autowired
    public TheoryServiceImpl(TheoryDetailRepository theoryDetailRepository, TheoryCategoryRepository theoryCategoryRepository) {
        this.theoryDetailRepository = theoryDetailRepository;
        this.theoryCategoryRepository = theoryCategoryRepository;
    }

    @Override
    public TheoryDetail addTheory(TheoryDetail theoryDetail) {
        return theoryDetailRepository.save(theoryDetail);
    }

    @Override
    public TheoryDetail updateTheory(TheoryDetail theoryDetail) {
        return theoryDetailRepository.saveAndFlush(theoryDetail);
    }

    @Override
    public TheoryDetail findById(int id) {
        return theoryDetailRepository.findById(id).orElse(null);
    }

    @Override
    public List<TheoryDetail> findAll() {
        return theoryDetailRepository.findAll();
    }

    @Override
    public TheoryCategory findTheoryCategoryByCatId(int catId) {
        return theoryCategoryRepository.findById(catId).orElse(null);
    }

    @Override
    public TheoryDetail findByTheoryCatId(int catId) {
        return theoryDetailRepository.findByTheoryCatId(catId).orElse(null);
    }


}
