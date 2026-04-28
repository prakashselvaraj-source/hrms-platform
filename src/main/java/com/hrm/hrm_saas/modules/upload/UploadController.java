package com.hrm.hrm_saas.modules.upload;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private final String BASE_DIR = System.getProperty("user.dir") + "/uploads/";

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        System.out.println("uploadFile");

        // ✅ 1. Validate empty
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "File is empty"));
        }

        // ✅ 2. Validate type
        String contentType = file.getContentType();
        if (!List.of("image/jpeg", "image/png", "application/pdf").contains(contentType)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Only JPG, PNG, PDF allowed"));
        }

        // ✅ 3. Validate size (2MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Max file size is 2MB"));
        }

        // ✅ 4. (Optional SaaS) Tenant folder
        String tenant = "default"; // 🔥 later get from JWT
        String uploadDir = BASE_DIR + tenant + "/";

        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        // ✅ 5. Unique filename
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        File destination = new File(uploadDir + fileName);
        file.transferTo(destination);

        // ✅ 6. Return JSON
        String fileUrl = "http://localhost:8080/uploads/" + tenant + "/" + fileName;

        return ResponseEntity.ok(Map.of(
                "url", fileUrl,
                "fileName", file.getOriginalFilename()
        ));
    }
}