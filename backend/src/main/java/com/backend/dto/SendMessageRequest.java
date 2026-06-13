package com.backend.dto;

public class SendMessageRequest {

    private String candidateId;
    private String title;
    private String message;
    private String relatedJobId; // optional

    public String getCandidateId() { return candidateId; }
    public void setCandidateId(String candidateId) { this.candidateId = candidateId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getRelatedJobId() { return relatedJobId; }
    public void setRelatedJobId(String relatedJobId) { this.relatedJobId = relatedJobId; }
}