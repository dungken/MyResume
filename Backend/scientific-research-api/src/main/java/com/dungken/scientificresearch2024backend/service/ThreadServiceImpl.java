package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.dao.ThreadRepository;
import com.dungken.scientificresearch2024backend.entity.Thread;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ThreadServiceImpl implements ThreadService{
    private ThreadRepository threadRepository;

    @Autowired
    public ThreadServiceImpl(ThreadRepository threadRepository) {
        this.threadRepository = threadRepository;
    }

    @Override
    public Thread addThread(Thread thread) {
        return threadRepository.save(thread);
    }

    @Override
    public Thread updateThread(Thread thread) {
        return threadRepository.saveAndFlush(thread);
    }

    @Override
    public Thread findById(int id) {
        return threadRepository.findById(id).orElse(null);
    }

}
