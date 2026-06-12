package com.backend.controller;

import com.backend.service.ResumeStorageService;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @Autowired
    private ResumeStorageService resumeStorageService;

    @GetMapping("/{fileId}")
    public ResponseEntity<byte[]> serveResume(@PathVariable String fileId) throws IOException {
        GridFSFile gridFSFile = resumeStorageService.findById(fileId);

        if (gridFSFile == null) {
            return ResponseEntity.notFound().build();
        }

        InputStream inputStream = resumeStorageService.getResourceStream(gridFSFile);
        byte[] data = inputStream.readAllBytes();

        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_PDF)
            .header(HttpHeaders.CONTENT_DISPOSITION,
                    "inline; filename=\"" + gridFSFile.getFilename() + "\"")
            .body(data);
    }
}