package com.dungken.scientificresearch2024backend.controller;

import com.dungken.scientificresearch2024backend.dao.TheoryDetailRepository;
import com.dungken.scientificresearch2024backend.dao.UserRepository;
import com.dungken.scientificresearch2024backend.dto.TheoryDetailRequest;
import com.dungken.scientificresearch2024backend.dto.TheoryExampleRequest;
import com.dungken.scientificresearch2024backend.entity.TheoryCategory;
import com.dungken.scientificresearch2024backend.entity.TheoryDetail;
import com.dungken.scientificresearch2024backend.entity.TheoryExample;
import com.dungken.scientificresearch2024backend.entity.User;
import com.dungken.scientificresearch2024backend.service.TheoryExampleService;
import com.dungken.scientificresearch2024backend.service.TheoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/theory/example")
public class TheoryExampleController {
    private UserRepository userRepository;
    private TheoryExampleService theoryExampleService;

    @Autowired
    public TheoryExampleController(UserRepository userRepository, TheoryExampleService theoryExampleService) {
        this.userRepository = userRepository;
        this.theoryExampleService = theoryExampleService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addTheoryExample(@RequestBody TheoryExampleRequest theoryExampleRequest){
        User user = userRepository.findById(theoryExampleRequest.getUserId()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User or theory not found");
        }

        TheoryExample theoryExample = new TheoryExample();
        theoryExample.setName(theoryExampleRequest.getName());
        theoryExample.setAnswer(theoryExampleRequest.getAnswer());
        theoryExample.setUser(user);

        theoryExampleService.addTheoryExample(theoryExample);
        return ResponseEntity.ok("Insert theory example successfully!");
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateTheoryExample(@RequestBody TheoryExampleRequest theoryExampleRequest){
        TheoryExample theoryExample = theoryExampleService.findById(theoryExampleRequest.getExampleId());
        User user = userRepository.findById(theoryExampleRequest.getUserId()).orElse(null);

        if (theoryExample == null) {
            return ResponseEntity.badRequest().body("Theory or theory example cat not found");
        }

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        theoryExample.setName(theoryExampleRequest.getName());
        theoryExample.setAnswer(theoryExampleRequest.getAnswer());
        theoryExample.setUser(user);

        theoryExampleService.updateTheoryExample(theoryExample);
        return ResponseEntity.ok("Update theory example successfully!");
    }
}
