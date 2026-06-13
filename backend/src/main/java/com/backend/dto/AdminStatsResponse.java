package com.backend.dto;

public class AdminStatsResponse {

    private long totalUsers;
    private long totalCandidates;
    private long totalRecruiters;
    private long totalJobs;
    private long activeJobs;
    private long closedJobs;
    private long totalApplications;

    public AdminStatsResponse() {}

    public AdminStatsResponse(long totalUsers, long totalCandidates, long totalRecruiters,
                               long totalJobs, long activeJobs, long closedJobs, long totalApplications) {
        this.totalUsers = totalUsers;
        this.totalCandidates = totalCandidates;
        this.totalRecruiters = totalRecruiters;
        this.totalJobs = totalJobs;
        this.activeJobs = activeJobs;
        this.closedJobs = closedJobs;
        this.totalApplications = totalApplications;
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalCandidates() { return totalCandidates; }
    public void setTotalCandidates(long totalCandidates) { this.totalCandidates = totalCandidates; }

    public long getTotalRecruiters() { return totalRecruiters; }
    public void setTotalRecruiters(long totalRecruiters) { this.totalRecruiters = totalRecruiters; }

    public long getTotalJobs() { return totalJobs; }
    public void setTotalJobs(long totalJobs) { this.totalJobs = totalJobs; }

    public long getActiveJobs() { return activeJobs; }
    public void setActiveJobs(long activeJobs) { this.activeJobs = activeJobs; }

    public long getClosedJobs() { return closedJobs; }
    public void setClosedJobs(long closedJobs) { this.closedJobs = closedJobs; }

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }
}