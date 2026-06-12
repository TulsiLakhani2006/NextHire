package com.backend.service;

import java.io.IOException;
import java.io.InputStream;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.mongodb.client.gridfs.model.GridFSFile;

@Service
public class ResumeStorageService {

    @Autowired
    private GridFsTemplate gridFsTemplate;

    @Autowired
    private GridFsOperations gridFsOperations;

    @Value("${app.resume.base-url:http://localhost:8080/api/resume/}")
    private String baseUrl;

    // Store file in GridFS, return accessible URL
    public String store(MultipartFile file) throws IOException {
        if (file.isEmpty()) throw new IllegalArgumentException("File is empty");
        if (!"application/pdf".equals(file.getContentType()))
            throw new IllegalArgumentException("Only PDF files are allowed");

        // Delete old file if same name exists (optional safety)
        gridFsTemplate.delete(
            new Query(Criteria.where("filename").is(file.getOriginalFilename()))
        );

        // Save to GridFS
        ObjectId fileId = gridFsTemplate.store(
            file.getInputStream(),
            file.getOriginalFilename(),
            file.getContentType()
        );

        // Return URL pointing to our new serve endpoint
        return baseUrl + fileId.toString();
    }

    // Retrieve file stream by GridFS file ID
    public GridFSFile findById(String fileId) {
        return gridFsTemplate.findOne(
            new Query(Criteria.where("_id").is(new ObjectId(fileId)))
        );
    }

    public InputStream getResourceStream(GridFSFile gridFSFile) throws IOException {
        return gridFsOperations.getResource(gridFSFile).getInputStream();
    }
}