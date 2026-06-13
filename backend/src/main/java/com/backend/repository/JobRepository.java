package com.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.backend.model.Job;
import com.backend.model.JobStatus;

public interface JobRepository extends MongoRepository<Job, String> {
    Page<Job> findByStatus(JobStatus status, Pageable pageable);
    long countByStatus(JobStatus status);
    List<Job> findByPostedByOrderByCreatedAtDesc(String recruiterId);
    Page<Job> findByStatusAndTitleContainingIgnoreCase(
            JobStatus status, String title, Pageable pageable);
    List<Job> findByPostedBy(String postedBy);
}