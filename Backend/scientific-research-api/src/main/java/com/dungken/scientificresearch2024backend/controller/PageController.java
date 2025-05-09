package com.dungken.scientificresearch2024backend.controller;

import com.dungken.scientificresearch2024backend.dao.UserRepository;
import com.dungken.scientificresearch2024backend.dto.PageRequest;
import com.dungken.scientificresearch2024backend.entity.Page;
import com.dungken.scientificresearch2024backend.entity.User;
import com.dungken.scientificresearch2024backend.service.PageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/page")
public class PageController {
    private UserRepository userRepository;
    private PageService pageService;

    @Autowired
    public PageController(PageService pageService, UserRepository userRepository) {
        this.pageService = pageService;
        this.userRepository = userRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addPage(@RequestBody PageRequest pageRequest){
        User user = userRepository.findById(pageRequest.getUserId()).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Page page = new Page();
        page.setPageName(pageRequest.getPageName());
        page.setShortDesc(pageRequest.getShortDesc());
        page.setDetail(pageRequest.getDetail());
        page.setUser(user);

        pageService.addPage(page);
        return ResponseEntity.ok("Insert page successfully!");
    }

    @PutMapping("/update")
    public ResponseEntity<?> updatePage(@RequestBody PageRequest pageRequest){
        Page pageExisting = pageService.findById(pageRequest.getPageId());
        User user = userRepository.findById(pageRequest.getUserId()).orElse(null);

        if (pageExisting == null) {
            return ResponseEntity.badRequest().body("Page not found");
        }

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        pageExisting.setPageName(pageRequest.getPageName());
        pageExisting.setShortDesc(pageRequest.getShortDesc());
        pageExisting.setDetail(pageRequest.getDetail());
        pageExisting.setUser(user);

        pageService.updatePage(pageExisting);
        return ResponseEntity.ok("Update page successfully!");
    }
}
