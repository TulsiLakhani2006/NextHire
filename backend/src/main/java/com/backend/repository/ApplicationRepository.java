package com.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.backend.model.Application;
import com.backend.model.ApplicationStatus;

public interface ApplicationRepository extends MongoRepository<Application, String> {
    Optional<Application>       findByCandidateIdAndJobId(String candidateId, String jobId);
    List<Application>           findByCandidateIdOrderByAppliedAtDesc(String candidateId);
    Page<Application>           findByJobId(String jobId, Pageable pageable);
    long                        countByJobId(String jobId);
   Page<Application> findByJobIdAndStatusNot(String jobId, ApplicationStatus status, Pageable pageable);
long countByJobIdAndStatusNot(String jobId, ApplicationStatus status);
List<Application> findByJobIdIn(List<String> jobIds);
}