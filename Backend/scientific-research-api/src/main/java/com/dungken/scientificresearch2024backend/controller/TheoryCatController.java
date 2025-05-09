package com.dungken.scientificresearch2024backend.controller;

import com.dungken.scientificresearch2024backend.dao.UserRepository;
import com.dungken.scientificresearch2024backend.dto.TheoryCategoryRequest;
import com.dungken.scientificresearch2024backend.dto.TheoryDetailRequest;
import com.dungken.scientificresearch2024backend.entity.TheoryCategory;
import com.dungken.scientificresearch2024backend.entity.TheoryDetail;
import com.dungken.scientificresearch2024backend.entity.User;
import com.dungken.scientificresearch2024backend.service.TheoryCatService;
import com.dungken.scientificresearch2024backend.service.TheoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/theory/cat")
public class TheoryCatController {
    private UserRepository userRepository;
    private TheoryCatService theoryCatService;

    @Autowired
    public TheoryCatController(UserRepository userRepository, TheoryCatService theoryCatService) {
        this.userRepository = userRepository;
        this.theoryCatService = theoryCatService;
    }

    @GetMapping("")
    public ResponseEntity<?> getAllTheoryCats(){
        List<TheoryCategory> theoryCats = theoryCatService.findAll();
        List<TheoryCategoryRequest> theoryCatDTOs = new ArrayList<>();
        for (TheoryCategory theoryCat : theoryCats) {
            TheoryCategoryRequest dto = new TheoryCategoryRequest();
            dto.setTheoryCatId(theoryCat.getTheoryCatId());
            dto.setTheoryParentCatId(theoryCat.getTheoryParentCatId());
            dto.setName(theoryCat.getName());
            theoryCatDTOs.add(dto);
        }
        return ResponseEntity.ok().body(theoryCatDTOs);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addTheoryCat(@RequestBody TheoryCategoryRequest theoryCategoryRequest){
        User user = userRepository.findById(theoryCategoryRequest.getUserId()).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        TheoryCategory theoryCategory = new TheoryCategory();
        theoryCategory.setName(theoryCategoryRequest.getName());
        theoryCategory.setShortDesc(theoryCategoryRequest.getShortDesc());
        theoryCategory.setTheoryParentCatId(theoryCategoryRequest.getTheoryParentCatId());
        theoryCategory.setUser(user);

        theoryCatService.addTheoryCat(theoryCategory);
        return ResponseEntity.ok("Insert theory topic successfully!");
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateTheoryCat(@RequestBody TheoryCategoryRequest theoryCategoryRequest){
        TheoryCategory theoryCategory = theoryCatService.findById(theoryCategoryRequest.getTheoryCatId());
        User user = userRepository.findById(theoryCategoryRequest.getUserId()).orElse(null);


        if (theoryCategory == null) {
            return ResponseEntity.badRequest().body("Theory Cat not found");
        }

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        theoryCategory.setName(theoryCategoryRequest.getName());
        theoryCategory.setShortDesc(theoryCategoryRequest.getShortDesc());
        theoryCategory.setTheoryParentCatId(theoryCategoryRequest.getTheoryParentCatId());
        theoryCategory.setUser(user);

        theoryCatService.updateTheoryCat(theoryCategory);
        return ResponseEntity.ok("Update theory cat successfully!");
    }
}
