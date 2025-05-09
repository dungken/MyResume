package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.dao.ThreadCategoryRepository;
import com.dungken.scientificresearch2024backend.entity.ThreadCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ThreadCatServiceImpl implements ThreadCatService{
    private ThreadCategoryRepository threadCategoryRepository;

    @Autowired
    public ThreadCatServiceImpl(ThreadCategoryRepository threadCategoryRepository) {
        this.threadCategoryRepository = threadCategoryRepository;
    }

    @Override
    public ThreadCategory addThreadCategory(ThreadCategory threadCategory) {
        return threadCategoryRepository.save(threadCategory);
    }

    @Override
    public ThreadCategory updateThreadCategory(ThreadCategory threadCategory) {
        return threadCategoryRepository.saveAndFlush(threadCategory);
    }

    @Override
    public ThreadCategory findById(int id) {
        return threadCategoryRepository.findById(id).orElse(null);
    }

}
