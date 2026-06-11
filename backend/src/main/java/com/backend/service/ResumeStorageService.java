package com.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * MVP: Stores PDF locally under /uploads/resumes/
 * Later: swap saveLocally() for an S3 upload call.
 */
@Service
public class ResumeStorageService {

    // Base URL your Spring Boot serves static files from
    @Value("${app.resume.base-url:http://localhost:8080/resumes/}")
    private String baseUrl;

    @Value("${app.resume.upload-dir:uploads/resumes}")
    private String uploadDir;

    public String store(MultipartFile file) throws IOException {
        if (file.isEmpty()) throw new IllegalArgumentException("File is empty");

        String contentType = file.getContentType();
        if (!"application/pdf".equals(contentType)) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }

        // Create directory if absent
        Path dirPath = Paths.get(uploadDir);
        if (!Files.exists(dirPath)) Files.createDirectories(dirPath);

        // Unique filename
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = dirPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        return baseUrl + filename;   // public-accessible URL
    }
}