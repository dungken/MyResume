package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.dao.TheoryDetailRepository;
import com.dungken.scientificresearch2024backend.dao.TheoryKeywordRepository;
import com.dungken.scientificresearch2024backend.entity.TheoryDetail;
import com.dungken.scientificresearch2024backend.entity.TheoryKeyword;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TheoryKeywordServiceImpl implements TheoryKeywordService{
    private TheoryKeywordRepository theoryKeywordRepository;
    private TheoryDetailRepository theoryDetailRepository;

    @Autowired
    public TheoryKeywordServiceImpl(TheoryKeywordRepository theoryKeywordRepository, TheoryDetailRepository theoryDetailRepository) {
        this.theoryKeywordRepository = theoryKeywordRepository;
        this.theoryDetailRepository = theoryDetailRepository;
    }

    @Override
    public TheoryKeyword addTheoryKeyword(TheoryKeyword theoryKeyword) {
        return theoryKeywordRepository.save(theoryKeyword);
    }

    @Override
    public TheoryKeyword updateTheoryKeyword(TheoryKeyword theoryKeyword) {
        return theoryKeywordRepository.saveAndFlush(theoryKeyword);
    }

    @Override
    public TheoryKeyword findById(int id) {
        return theoryKeywordRepository.findById(id).orElse(null);
    }

    @Override
    public TheoryDetail findTheoryDetailByKeywordEqualsIgnoreCase(String keyword) {
        return theoryKeywordRepository.findTheoryDetailByKeywordEqualsIgnoreCase(keyword).orElse(null);
    }


}
