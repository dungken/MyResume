package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.entity.ThreadComment;

public interface ThreadCommentService {
    public ThreadComment addThreadComment(ThreadComment threadComment);
    public ThreadComment updateThreadComment(ThreadComment threadComment);
    public ThreadComment findById(int id);
}
