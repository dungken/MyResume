package com.dungken.scientificresearch2024backend.controller;

import com.dungken.scientificresearch2024backend.dao.TheoryDetailRepository;
import com.dungken.scientificresearch2024backend.dao.UserRepository;
import com.dungken.scientificresearch2024backend.dto.TheoryDetailRequest;
import com.dungken.scientificresearch2024backend.dto.TheoryExampleRequest;
import com.dungken.scientificresearch2024backend.dto.TheoryKeywordExampleRequest;
import com.dungken.scientificresearch2024backend.dto.TheoryKeywordRequest;
import com.dungken.scientificresearch2024backend.entity.*;
import com.dungken.scientificresearch2024backend.entity.TheoryKeywordExample;
import com.dungken.scientificresearch2024backend.service.TheoryExampleService;
import com.dungken.scientificresearch2024backend.service.TheoryKeywordExampleService;
import com.dungken.scientificresearch2024backend.service.TheoryKeywordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/theory/example/keyword")
public class TheoryKeywordExampleController {
    private UserRepository userRepository;
    private TheoryKeywordExampleService theoryKeywordExampleService;
    private TheoryExampleService theoryExampleService;

    @Autowired
    public TheoryKeywordExampleController(UserRepository userRepository, TheoryKeywordExampleService theoryKeywordExampleService, TheoryExampleService theoryExampleService) {
        this.userRepository = userRepository;
        this.theoryKeywordExampleService = theoryKeywordExampleService;
        this.theoryExampleService = theoryExampleService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addTheoryKeywordExample(@RequestBody TheoryKeywordExampleRequest theoryKeywordExampleRequest){
        User user = userRepository.findById(theoryKeywordExampleRequest.getUserId()).orElse(null);
        TheoryExample theoryExample = theoryExampleService.findById(theoryKeywordExampleRequest.getExampleId());

        if (user == null && theoryExample == null) {
            return ResponseEntity.badRequest().body("User or theoryExample not found");
        }

        TheoryKeywordExample theoryKeywordExample = new TheoryKeywordExample();
        theoryKeywordExample.setKeyword(theoryKeywordExampleRequest.getKeyword());
        theoryKeywordExample.setTheoryExample(theoryExample);
        theoryKeywordExample.setUser(user);

        theoryKeywordExampleService.addTheoryKeywordExample(theoryKeywordExample);
        return ResponseEntity.ok("Insert theory keyword example successfully!");
    }


    @PutMapping("/update")
    public ResponseEntity<?> updateTheoryKeywordExample(@RequestBody TheoryKeywordExampleRequest theoryKeywordExampleRequest){
        TheoryKeywordExample theoryKeywordExample = theoryKeywordExampleService.findById(theoryKeywordExampleRequest.getKeywordExampleId());
        User user = userRepository.findById(theoryKeywordExampleRequest.getUserId()).orElse(null);
        TheoryExample theoryExample = theoryExampleService.findById(theoryKeywordExampleRequest.getExampleId());

        if (theoryKeywordExample == null && user == null && theoryExample == null) {
            return ResponseEntity.badRequest().body("Theory or theory keyword cat not found");
        }

        theoryKeywordExample.setKeyword(theoryKeywordExampleRequest.getKeyword());
        theoryKeywordExample.setTheoryExample(theoryExample);
        theoryKeywordExample.setUser(user);

        theoryKeywordExampleService.updateTheoryKeywordExample(theoryKeywordExample);
        return ResponseEntity.ok("Update theory keyword example successfully!");
    }

    @GetMapping("/search/{keyword}")
    public ResponseEntity<?> search(@PathVariable String keyword) {
        TheoryExample theoryExample = theoryKeywordExampleService.findTheoryExampleByKeywordEqualsIgnoreCase(keyword);
        if (theoryExample != null) {
            TheoryExampleRequest reducedExample = new TheoryExampleRequest();
            reducedExample.setName(theoryExample.getName());
            reducedExample.setAnswer(theoryExample.getAnswer());
            reducedExample.setExampleId(theoryExample.getExampleId());

            return new ResponseEntity<>(reducedExample, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
