package com.backend.repository;

import com.backend.model.Job;
import com.backend.model.JobStatus;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface JobRepository extends MongoRepository<Job, String> {
    Page<Job> findByStatus(JobStatus status, Pageable pageable);
    List<Job> findByPostedByOrderByCreatedAtDesc(String recruiterId);
    Page<Job> findByStatusAndTitleContainingIgnoreCase(
            JobStatus status, String title, Pageable pageable);
    List<Job> findByPostedBy(String postedBy);
}