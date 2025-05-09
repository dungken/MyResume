package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.entity.Page;

public interface PageService {
    public Page addPage(Page page);
    public Page updatePage(Page page);
    public Page findById(int id);
}
