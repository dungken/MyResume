package com.dungken.scientificresearch2024backend.controller;

import com.dungken.scientificresearch2024backend.dao.TheoryDetailRepository;
import com.dungken.scientificresearch2024backend.dao.UserRepository;
import com.dungken.scientificresearch2024backend.dto.TheoryDetailRequest;
import com.dungken.scientificresearch2024backend.dto.TheoryKeywordRequest;
import com.dungken.scientificresearch2024backend.entity.TheoryDetail;
import com.dungken.scientificresearch2024backend.entity.TheoryKeyword;
import com.dungken.scientificresearch2024backend.entity.User;
import com.dungken.scientificresearch2024backend.service.TheoryKeywordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("api/theory/keyword")
public class TheoryKeywordController {
    private UserRepository userRepository;
    private TheoryKeywordService theoryKeywordService;
    private TheoryDetailRepository theoryDetailRepository;

    @Autowired
    public TheoryKeywordController(UserRepository userRepository, TheoryKeywordService theoryKeywordService,
                                   TheoryDetailRepository theoryDetailRepository) {
        this.userRepository = userRepository;
        this.theoryKeywordService = theoryKeywordService;
        this.theoryDetailRepository = theoryDetailRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addTheoryKeyword(@RequestBody TheoryKeywordRequest theoryKeywordRequest){
        User user = userRepository.findById(theoryKeywordRequest.getUserId()).orElse(null);
        TheoryDetail theoryDetail = theoryDetailRepository.findById(theoryKeywordRequest.getTheoryDetailId()).orElse(null);
        if (user == null && theoryDetail == null) {
            return ResponseEntity.badRequest().body("User or theory not found");
        }

        TheoryKeyword theoryKeyword = new TheoryKeyword();
        theoryKeyword.setKeyword(theoryKeywordRequest.getKeyword());
        theoryKeyword.setTheoryDetail(theoryDetail);
        theoryKeyword.setUser(user);

        theoryKeywordService.addTheoryKeyword(theoryKeyword);
        return ResponseEntity.ok("Insert theory keyword successfully!");
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateTheoryKeyword(@RequestBody TheoryKeywordRequest theoryKeywordRequest){
        TheoryKeyword theoryKeyword = theoryKeywordService.findById(theoryKeywordRequest.getKeywordId());
        User user = userRepository.findById(theoryKeywordRequest.getUserId()).orElse(null);
        TheoryDetail theoryDetail = theoryDetailRepository.findById(theoryKeywordRequest.getTheoryDetailId()).orElse(null);


        if (theoryKeyword == null && theoryKeyword == null) {
            return ResponseEntity.badRequest().body("Theory or theory keyword cat not found");
        }

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        theoryKeyword.setKeyword(theoryKeywordRequest.getKeyword());
        theoryKeyword.setTheoryDetail(theoryDetail);
        theoryKeyword.setUser(user);

        theoryKeywordService.updateTheoryKeyword(theoryKeyword);
        return ResponseEntity.ok("Update theory keyword successfully!");
    }

    @GetMapping("/search/{keyword}")
    public ResponseEntity<?> search(@PathVariable String keyword) {
        TheoryDetail theoryDetailOptional = theoryKeywordService.findTheoryDetailByKeywordEqualsIgnoreCase(keyword);
        if (theoryDetailOptional != null) {
            TheoryDetailRequest reducedDetail = new TheoryDetailRequest();
            reducedDetail.setContent(theoryDetailOptional.getContent());
            reducedDetail.setTitle(theoryDetailOptional.getTitle());
            reducedDetail.setTheoryCatId(theoryDetailOptional.getTheoryCategory().getTheoryCatId());

            return new ResponseEntity<>(reducedDetail, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
