package com.dungken.scientificresearch2024backend.controller;

import com.dungken.scientificresearch2024backend.dao.UserRepository;
import com.dungken.scientificresearch2024backend.dto.ThreadRequest;
import com.dungken.scientificresearch2024backend.entity.Thread;
import com.dungken.scientificresearch2024backend.entity.ThreadCategory;
import com.dungken.scientificresearch2024backend.entity.User;
import com.dungken.scientificresearch2024backend.service.ThreadCatService;
import com.dungken.scientificresearch2024backend.service.ThreadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/thread")
public class ThreadController {
    private UserRepository userRepository;
    private ThreadCatService threadCatService;
    private ThreadService threadService;

    @Autowired
    public ThreadController(ThreadCatService threadCatService, UserRepository userRepository, ThreadService threadService) {
        this.threadCatService = threadCatService;
        this.threadService = threadService;
        this.userRepository = userRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addThread(@RequestBody ThreadRequest threadRequest){
        User user = userRepository.findById(threadRequest.getUserId()).orElse(null);
        ThreadCategory threadCategory = threadCatService.findById(threadRequest.getThreadCatId());
        
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        if (threadCategory == null) {
            return ResponseEntity.badRequest().body("ThreadCategory not found");
        }
        
        Thread thread = new Thread();
        thread.setShortQuestion(threadRequest.getShortQuestion());
        thread.setDetailQuestion(threadRequest.getDetailQuestion());
        thread.setViews(threadRequest.getViews());
        thread.setReplies(threadRequest.getReplies());
        thread.setVotes(threadRequest.getVotes());
        thread.setStatus(threadRequest.isStatus());
        thread.setUser(user);
        thread.setThreadCategory(threadCategory);

        threadService.addThread(thread);
        return ResponseEntity.ok().body(thread.getThreadId());
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateThread(@RequestBody ThreadRequest threadRequest){
        Thread threadExisting = threadService.findById(threadRequest.getThreadId());
        User user = userRepository.findById(threadRequest.getUserId()).orElse(null);
        ThreadCategory threadCategory = threadCatService.findById(threadRequest.getThreadCatId());

        if (threadExisting == null) {
            return ResponseEntity.badRequest().body("Thread not found");
        }

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        if (threadCategory == null) {
            return ResponseEntity.badRequest().body("ThreadCategory not found");
        }

        threadExisting.setShortQuestion(threadRequest.getShortQuestion());
        threadExisting.setDetailQuestion(threadRequest.getDetailQuestion());
        threadExisting.setViews(threadRequest.getViews());
        threadExisting.setReplies(threadRequest.getReplies());
        threadExisting.setVotes(threadRequest.getVotes());
        threadExisting.setStatus(threadRequest.isStatus());
        threadExisting.setUser(user);
        threadExisting.setThreadCategory(threadCategory);

        threadService.updateThread(threadExisting);
        return ResponseEntity.ok("Update thread successfully!");
    }


}
