package com.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Value("${test.value}")
    private String testValue;

    @GetMapping("/test-config")
    public String testConfig() {
        return "test=" + testValue + " | mongo=" + mongoUri;
    }
}
