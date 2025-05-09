package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.entity.PostDetail;

public interface PostService {
    public PostDetail addPost(PostDetail postDetail);
    public PostDetail updatePost(PostDetail postDetail);
    public PostDetail findById(int id);
}
