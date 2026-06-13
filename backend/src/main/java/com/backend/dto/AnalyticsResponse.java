package com.backend.dto;

import java.util.List;
import java.util.Map;

public class AnalyticsResponse {

    private long totalJobs;
    private long activeJobs;
    private long totalApplicants;
    private long totalHired;

    private Map<String, Long> applicationsByStatus; // e.g. APPLIED, SHORTLISTED, REJECTED, HIRED
    private Map<String, Long> jobsByType;            // e.g. FULL_TIME, PART_TIME, INTERNSHIP
    private List<DailyCount> applicationsOverTime;   // last 30 days
    private List<JobApplicantCount> topJobsByApplicants; // top 5

    // --- getters and setters ---

    public long getTotalJobs() { return totalJobs; }
    public void setTotalJobs(long totalJobs) { this.totalJobs = totalJobs; }

    public long getActiveJobs() { return activeJobs; }
    public void setActiveJobs(long activeJobs) { this.activeJobs = activeJobs; }

    public long getTotalApplicants() { return totalApplicants; }
    public void setTotalApplicants(long totalApplicants) { this.totalApplicants = totalApplicants; }

    public long getTotalHired() { return totalHired; }
    public void setTotalHired(long totalHired) { this.totalHired = totalHired; }

    public Map<String, Long> getApplicationsByStatus() { return applicationsByStatus; }
    public void setApplicationsByStatus(Map<String, Long> applicationsByStatus) { this.applicationsByStatus = applicationsByStatus; }

    public Map<String, Long> getJobsByType() { return jobsByType; }
    public void setJobsByType(Map<String, Long> jobsByType) { this.jobsByType = jobsByType; }

    public List<DailyCount> getApplicationsOverTime() { return applicationsOverTime; }
    public void setApplicationsOverTime(List<DailyCount> applicationsOverTime) { this.applicationsOverTime = applicationsOverTime; }

    public List<JobApplicantCount> getTopJobsByApplicants() { return topJobsByApplicants; }
    public void setTopJobsByApplicants(List<JobApplicantCount> topJobsByApplicants) { this.topJobsByApplicants = topJobsByApplicants; }

    // --- nested static classes ---

    public static class DailyCount {
    private String date;
    private long count;

    public DailyCount() {} // required for Jackson/Redis

    public DailyCount(String date, long count) {
        this.date = date;
        this.count = count;
    }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public long getCount() { return count; }
    public void setCount(long count) { this.count = count; }
}

public static class JobApplicantCount {
    private String jobId;
    private String title;
    private long applicantCount;

    public JobApplicantCount() {} // required for Jackson/Redis

    public JobApplicantCount(String jobId, String title, long applicantCount) {
        this.jobId = jobId;
        this.title = title;
        this.applicantCount = applicantCount;
    }

    public String getJobId() { return jobId; }
    public void setJobId(String jobId) { this.jobId = jobId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public long getApplicantCount() { return applicantCount; }
    public void setApplicantCount(long applicantCount) { this.applicantCount = applicantCount; }
}
}