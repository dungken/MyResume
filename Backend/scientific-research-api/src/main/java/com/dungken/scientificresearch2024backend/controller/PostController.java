package com.dungken.scientificresearch2024backend.controller;

import com.dungken.scientificresearch2024backend.dao.PostCategoryRepository;
import com.dungken.scientificresearch2024backend.dao.PostDetailRepository;
import com.dungken.scientificresearch2024backend.dao.UserRepository;
import com.dungken.scientificresearch2024backend.dto.PostRequest;
import com.dungken.scientificresearch2024backend.dto.UserRequest;
import com.dungken.scientificresearch2024backend.entity.*;
import com.dungken.scientificresearch2024backend.service.AccountService;
import com.dungken.scientificresearch2024backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/post")
public class PostController {
    private PostCategoryRepository postCategoryRepository;
    private UserRepository userRepository;
    private PostService postService;

    @Autowired
    public PostController(PostService postService, PostCategoryRepository postCategoryRepository, UserRepository userRepository) {
        this.postService = postService;
        this.postCategoryRepository = postCategoryRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addPost(@RequestBody PostRequest postRequest){
        PostCategory postCategory = postCategoryRepository.findById(postRequest.getPostCatId()).orElse(null);
        User user = userRepository.findById(postRequest.getUserId()).orElse(null);

        // Kiểm tra postCategory và user có tồn tại không
        if (postCategory == null || user == null) {
            return ResponseEntity.badRequest().body("Post category or user not found");
        }

        PostDetail postDetail = new PostDetail();
        postDetail.setTitle(postRequest.getTitle());
        postDetail.setDesc(postRequest.getDesc());
        postDetail.setDetail(postRequest.getDetail());
        postDetail.setThumbnail(postRequest.getThumbnail());
        postDetail.setPostCategory(postCategory);
        postDetail.setUser(user);

        postService.addPost(postDetail);
        return ResponseEntity.ok("Insert post detail successfully!");
    }

    @PutMapping("/update")
    public ResponseEntity<?> updatePost(@RequestBody PostRequest postRequest){
        PostDetail post = postService.findById(postRequest.getPostId());
        PostCategory postCategory = postCategoryRepository.findById(postRequest.getPostCatId()).orElse(null);
        User user = userRepository.findById(postRequest.getUserId()).orElse(null);

        if (post == null) {
            return ResponseEntity.badRequest().body("Post not found");
        }

        // Kiểm tra postCategory và user có tồn tại không
        if (postCategory == null || user == null) {
            return ResponseEntity.badRequest().body("Post category or user not found");
        }

        post.setTitle(postRequest.getTitle());
        post.setDesc(postRequest.getDesc());
        post.setDetail(postRequest.getDetail());
        post.setThumbnail(postRequest.getThumbnail());
        post.setPostCategory(postCategory);
        post.setUser(user);

        postService.updatePost(post);
        return ResponseEntity.ok("Update post detail successfully!");
    }
}
