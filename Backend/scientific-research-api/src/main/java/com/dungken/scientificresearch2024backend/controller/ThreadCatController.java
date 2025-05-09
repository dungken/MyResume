package com.dungken.scientificresearch2024backend.controller;

import com.dungken.scientificresearch2024backend.dao.UserRepository;
import com.dungken.scientificresearch2024backend.dto.ThreadCategoryRequest;
import com.dungken.scientificresearch2024backend.entity.ThreadCategory;
import com.dungken.scientificresearch2024backend.entity.User;
import com.dungken.scientificresearch2024backend.service.ThreadCatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/thread/cat")
public class ThreadCatController {
    private UserRepository userRepository;
    private ThreadCatService threadCatService;

    @Autowired
    public ThreadCatController(ThreadCatService threadCatService, UserRepository userRepository) {
        this.threadCatService = threadCatService;
        this.userRepository = userRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addThreadCategory(@RequestBody ThreadCategoryRequest threadCategoryRequest){
        User user = userRepository.findById(threadCategoryRequest.getUserId()).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        ThreadCategory threadCategory = new ThreadCategory();
        threadCategory.setName(threadCategoryRequest.getName());
        threadCategory.setDescription(threadCategoryRequest.getDescription());
        threadCategory.setUser(user);

        threadCatService.addThreadCategory(threadCategory);
        return ResponseEntity.ok("Insert threadCategory successfully!");
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateThreadCategory(@RequestBody ThreadCategoryRequest threadCategoryRequest){
        ThreadCategory threadCategoryExisting = threadCatService.findById(threadCategoryRequest.getThreadCatId());
        User user = userRepository.findById(threadCategoryRequest.getUserId()).orElse(null);

        if (threadCategoryExisting == null) {
            return ResponseEntity.badRequest().body("ThreadCategory not found");
        }

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        threadCategoryExisting.setName(threadCategoryRequest.getName());
        threadCategoryExisting.setDescription(threadCategoryRequest.getDescription());
        threadCategoryExisting.setUser(user);

        threadCatService.updateThreadCategory(threadCategoryExisting);
        return ResponseEntity.ok("Update threadCategory successfully!");
    }
}
