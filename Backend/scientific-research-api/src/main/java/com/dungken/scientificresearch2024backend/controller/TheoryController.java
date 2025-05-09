package com.dungken.scientificresearch2024backend.controller;

import com.dungken.scientificresearch2024backend.dao.PostCategoryRepository;
import com.dungken.scientificresearch2024backend.dao.TheoryDetailRepository;
import com.dungken.scientificresearch2024backend.dao.UserRepository;
import com.dungken.scientificresearch2024backend.dto.PostRequest;
import com.dungken.scientificresearch2024backend.dto.TheoryCategoryRequest;
import com.dungken.scientificresearch2024backend.dto.TheoryDetailRequest;
import com.dungken.scientificresearch2024backend.entity.*;
import com.dungken.scientificresearch2024backend.service.PostService;
import com.dungken.scientificresearch2024backend.service.TheoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/theory")
public class TheoryController {
    private UserRepository userRepository;
    private TheoryService theoryService;
    private TheoryDetailRepository theoryDetailRepository;

    @Autowired
    public TheoryController(UserRepository userRepository, TheoryService theoryService, TheoryDetailRepository theoryDetailRepository) {
        this.userRepository = userRepository;
        this.theoryService = theoryService;
        this.theoryDetailRepository = theoryDetailRepository;
    }

    @GetMapping("")
    public ResponseEntity<?> getAllTheoryCats(){
        List<TheoryDetail> theoryDetails = theoryService.findAll();
        List<TheoryDetailRequest> theoryDTOs = new ArrayList<>();
        for (TheoryDetail theoryDetail : theoryDetails) {
            TheoryDetailRequest dto = new TheoryDetailRequest();
            dto.setTheoryDetailId(theoryDetail.getTheoryDetailId());
            dto.setTitle(theoryDetail.getTitle());
            theoryDTOs.add(dto);
        }
        return ResponseEntity.ok().body(theoryDTOs);
    }

    @GetMapping("/cat/{theoryCatId}")
    public ResponseEntity<?> getTheoryByCatId(@PathVariable Integer theoryCatId) {
        Optional<TheoryDetail> theoryDetailOptional = theoryDetailRepository.findByTheoryCatId(theoryCatId);
        if (theoryDetailOptional.isPresent()) {
            TheoryDetail theoryDetail = theoryDetailOptional.get();
            // Giảm dữ liệu trả về chỉ cần các trường cần thiết
            TheoryDetailRequest reducedDetail = new TheoryDetailRequest();
            reducedDetail.setContent(theoryDetail.getContent());
            reducedDetail.setTitle(theoryDetail.getTitle());
            // Tiếp tục giảm dữ liệu nếu cần thiết

            return new ResponseEntity<>(reducedDetail, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addTheory(@RequestBody TheoryDetailRequest theoryDetailRequest){
        User user = userRepository.findById(theoryDetailRequest.getUserId()).orElse(null);
        TheoryCategory theoryCategory = theoryService.findTheoryCategoryByCatId(theoryDetailRequest.getTheoryCatId());

        if (user == null && theoryCategory == null) {
            return ResponseEntity.badRequest().body("User or theory category not found");
        }

        TheoryDetail theoryDetail = new TheoryDetail();
        theoryDetail.setTitle(theoryDetailRequest.getTitle());
        theoryDetail.setContent(theoryDetailRequest.getContent());
        theoryDetail.setTheoryCategory(theoryCategory);
        theoryDetail.setUser(user);

        theoryService.addTheory(theoryDetail);
        return ResponseEntity.ok("Insert theory detail successfully!");
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateTheory(@RequestBody TheoryDetailRequest theoryDetailRequest){
        TheoryDetail theoryDetail = theoryService.findById(theoryDetailRequest.getTheoryDetailId());
        User user = userRepository.findById(theoryDetailRequest.getUserId()).orElse(null);
        TheoryCategory theoryCategory = theoryService.findTheoryCategoryByCatId(theoryDetailRequest.getTheoryCatId());


        if (theoryDetail == null && theoryCategory == null) {
            return ResponseEntity.badRequest().body("Theory or theory cat not found");
        }

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        theoryDetail.setTitle(theoryDetailRequest.getTitle());
        theoryDetail.setContent(theoryDetailRequest.getContent());
        theoryDetail.setTheoryCategory(theoryCategory);
        theoryDetail.setUser(user);

        theoryService.updateTheory(theoryDetail);
        return ResponseEntity.ok("Update theory detail successfully!");
    }
}
