package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.dao.PostDetailRepository;
import com.dungken.scientificresearch2024backend.entity.PostDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostServiceImpl implements PostService{
    private PostDetailRepository postDetailRepository;

    @Autowired
    public PostServiceImpl(PostDetailRepository postDetailRepository) {
        this.postDetailRepository = postDetailRepository;
    }

    @Override
    public PostDetail addPost(PostDetail postDetail) {
        return postDetailRepository.save(postDetail);
    }

    @Override
    public PostDetail updatePost(PostDetail postDetail) {
        return postDetailRepository.saveAndFlush(postDetail);
    }

    @Override
    public PostDetail findById(int id) {
        return postDetailRepository.findById(id).orElse(null);
    }


}
