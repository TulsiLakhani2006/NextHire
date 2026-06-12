package com.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.backend.model.Application;

public interface ApplicationRepository extends MongoRepository<Application, String> {

    List<Application> findByCandidateIdOrderByAppliedAtDesc(String candidateId);

    Optional<Application> findByCandidateIdAndJobId(String candidateId, String jobId);

    Page<Application> findByJobId(String jobId, Pageable pageable);

    long countByJobId(String jobId);
}