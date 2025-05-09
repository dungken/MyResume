package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.dao.TheoryDetailRepository;
import com.dungken.scientificresearch2024backend.dao.TheoryExampleRepository;
import com.dungken.scientificresearch2024backend.dao.TheoryKeywordExampleRepository;
import com.dungken.scientificresearch2024backend.dao.TheoryKeywordRepository;
import com.dungken.scientificresearch2024backend.entity.TheoryDetail;
import com.dungken.scientificresearch2024backend.entity.TheoryExample;
import com.dungken.scientificresearch2024backend.entity.TheoryKeyword;
import com.dungken.scientificresearch2024backend.entity.TheoryKeywordExample;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TheoryKeywordExampleServiceImpl implements TheoryKeywordExampleService{

    private TheoryKeywordExampleRepository theoryKeywordExampleRepository;

    @Autowired
    public TheoryKeywordExampleServiceImpl(TheoryKeywordExampleRepository theoryKeywordExampleRepository) {
        this.theoryKeywordExampleRepository = theoryKeywordExampleRepository;
    }

    @Override
    public TheoryKeywordExample addTheoryKeywordExample(TheoryKeywordExample theoryKeywordExample) {
        return theoryKeywordExampleRepository.save(theoryKeywordExample);
    }

    @Override
    public TheoryKeywordExample updateTheoryKeywordExample(TheoryKeywordExample theoryKeywordExample) {
        return theoryKeywordExampleRepository.saveAndFlush(theoryKeywordExample);
    }

    @Override
    public TheoryKeywordExample findById(int id) {
        return theoryKeywordExampleRepository.findById(id).orElse(null);
    }

    @Override
    public TheoryExample findTheoryExampleByKeywordEqualsIgnoreCase(String keyword) {
        return theoryKeywordExampleRepository.findTheoryExampleByKeywordEqualsIgnoreCase(keyword).orElse(null);
    }
}
