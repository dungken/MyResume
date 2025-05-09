package com.dungken.scientificresearch2024backend.controller;

import com.dungken.scientificresearch2024backend.dao.UserRepository;
import com.dungken.scientificresearch2024backend.dto.ThreadCommentRequest;
import com.dungken.scientificresearch2024backend.entity.Thread;
import com.dungken.scientificresearch2024backend.entity.ThreadCategory;
import com.dungken.scientificresearch2024backend.entity.ThreadComment;
import com.dungken.scientificresearch2024backend.entity.User;
import com.dungken.scientificresearch2024backend.service.ThreadCommentService;
import com.dungken.scientificresearch2024backend.service.ThreadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/thread/comment")
public class ThreadCommentController {
    private ThreadCommentService threadCommentService;
    private ThreadService threadService;

    @Autowired
    public ThreadCommentController(ThreadCommentService threadCommentService, UserRepository userRepository, ThreadService threadService) {
        this.threadCommentService = threadCommentService;
        this.threadService = threadService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addThreadComment(@RequestBody ThreadCommentRequest threadCommentRequest){
        Thread thread = threadService.findById(threadCommentRequest.getThreadId());
        
        if (thread == null) {
            return ResponseEntity.badRequest().body("Thread not found");
        }

        ThreadComment threadComment = new ThreadComment();
        threadComment.setComment(threadCommentRequest.getComment());
        threadComment.setCommentParentId(threadCommentRequest.getCommentParentId());
        threadComment.setLevel(threadCommentRequest.getLevel());
        threadComment.setStatus(threadCommentRequest.isStatus());
        threadComment.setUserId(threadCommentRequest.getUserId());
        threadComment.setThread(thread);

        threadCommentService.addThreadComment(threadComment);
        return ResponseEntity.ok("Insert thread comment successfully!");
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateThreadComment(@RequestBody ThreadCommentRequest threadCommentRequest){
        ThreadComment threadCommentExisting = threadCommentService.findById(threadCommentRequest.getCommentId());
        Thread thread = threadService.findById(threadCommentRequest.getThreadId());

        if (threadCommentExisting == null) {
            return ResponseEntity.badRequest().body("Thread comment not found");
        }

        if (thread == null) {
            return ResponseEntity.badRequest().body("Thread not found");
        }


        threadCommentExisting.setComment(threadCommentRequest.getComment());
        threadCommentExisting.setCommentParentId(threadCommentRequest.getCommentParentId());
        threadCommentExisting.setLevel(threadCommentRequest.getLevel());
        threadCommentExisting.setStatus(threadCommentRequest.isStatus());
        threadCommentExisting.setUserId(threadCommentRequest.getUserId());
        threadCommentExisting.setThread(thread);

        threadCommentService.updateThreadComment(threadCommentExisting);
        return ResponseEntity.ok("Update thread comment successfully!");
    }
}
