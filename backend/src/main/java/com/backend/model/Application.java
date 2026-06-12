package com.backend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "applications")
@CompoundIndex(name = "candidate_job_unique", def = "{'candidateId': 1, 'jobId': 1}", unique = true)
public class Application {

    @Id
    private String id;
    private String candidateId;
    private String jobId;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
    private String coverLetter;
    private String resumeSnapshot;
    private String recruiterNotes;

    public Application() {}

    public Application(String candidateId, String jobId, String resumeSnapshot, String coverLetter) {
        this.candidateId = candidateId;
        this.jobId = jobId;
        this.resumeSnapshot = resumeSnapshot;
        this.coverLetter = coverLetter;
        this.status = ApplicationStatus.APPLIED;
        this.appliedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCandidateId() { return candidateId; }
    public void setCandidateId(String candidateId) { this.candidateId = candidateId; }
    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }
    public String getResumeSnapshot() { return resumeSnapshot; }
    public void setResumeSnapshot(String resumeSnapshot) { this.resumeSnapshot = resumeSnapshot; }
    public String getRecruiterNotes() { return recruiterNotes; }
    public void setRecruiterNotes(String recruiterNotes) { this.recruiterNotes = recruiterNotes; }
}