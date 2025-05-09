package com.dungken.scientificresearch2024backend.service;

import com.dungken.scientificresearch2024backend.dao.PageRepository;
import com.dungken.scientificresearch2024backend.entity.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PageServiceImpl implements PageService{
    private PageRepository pageRepository;

    @Autowired
    public PageServiceImpl(PageRepository pageRepository) {
        this.pageRepository = pageRepository;
    }

    @Override
    public Page addPage(Page page) {
        return pageRepository.save(page);
    }

    @Override
    public Page updatePage(Page page) {
        return pageRepository.saveAndFlush(page);
    }

    @Override
    public Page findById(int id) {
        return pageRepository.findById(id).orElse(null);
    }

}
