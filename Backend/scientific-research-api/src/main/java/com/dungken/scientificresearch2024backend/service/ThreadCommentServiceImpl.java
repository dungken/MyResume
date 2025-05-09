package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.dao.ThreadCommentRepository;
import com.dungken.scientificresearch2024backend.entity.ThreadComment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ThreadCommentServiceImpl implements ThreadCommentService{
    private ThreadCommentRepository threadCommentRepository;

    @Autowired
    public ThreadCommentServiceImpl(ThreadCommentRepository threadCommentRepository) {
        this.threadCommentRepository = threadCommentRepository;
    }

    @Override
    public ThreadComment addThreadComment(ThreadComment threadComment) {
        return threadCommentRepository.save(threadComment);
    }

    @Override
    public ThreadComment updateThreadComment(ThreadComment threadComment) {
        return threadCommentRepository.saveAndFlush(threadComment);
    }

    @Override
    public ThreadComment findById(int id) {
        return threadCommentRepository.findById(id).orElse(null);
    }

}
