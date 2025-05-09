package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.entity.Thread;

public interface ThreadService {
    public Thread addThread(Thread thread);
    public Thread updateThread(Thread thread);
    public Thread findById(int id);
}
