package com.vinfast.charging.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.vinfast.charging.dto.response.ImageUploadResponse;

@Service
public class ImageUploadService {

    @Autowired
    private Cloudinary cloudinary;

    public ImageUploadResponse uploadImage(String imageId, MultipartFile file) {
        try {
            // delete old image on cloud
            if (imageId != null && !imageId.isEmpty()) {
                cloudinary.uploader().destroy(imageId, ObjectUtils.emptyMap());
            }

            String newPublicId = UUID.randomUUID().toString();

            Map<String, Object> options = new HashMap<>();
            options.put("public_id", newPublicId);

            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), options);

            String secureUrl = uploadResult.get("secure_url").toString();
            return new ImageUploadResponse(secureUrl, newPublicId);

        } catch (IOException e) {
            throw new RuntimeException("Image upload failed", e);
        }
    }

    @Async("taskExecutor")
    public CompletableFuture<ImageUploadResponse> uploadImageAsync(String publicId, MultipartFile file) {
        return CompletableFuture.completedFuture(uploadImage(publicId, file));
    }

}
