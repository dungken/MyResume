package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.entity.ThreadCategory;

public interface ThreadCatService {
    public ThreadCategory addThreadCategory(ThreadCategory threadCategory);
    public ThreadCategory updateThreadCategory(ThreadCategory threadCategory);
    public ThreadCategory findById(int id);
}
