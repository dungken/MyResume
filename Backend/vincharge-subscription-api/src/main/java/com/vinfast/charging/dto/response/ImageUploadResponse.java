package com.vinfast.charging.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImageUploadResponse {
  private String secureUrl;
  private String publicId;
}
