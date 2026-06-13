package com.backend.repository;

import com.backend.model.Application;
import com.backend.model.ApplicationStatus;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends MongoRepository<Application, String> {
    Optional<Application>       findByCandidateIdAndJobId(String candidateId, String jobId);
    List<Application>           findByCandidateIdOrderByAppliedAtDesc(String candidateId);
    Page<Application>           findByJobId(String jobId, Pageable pageable);
    long                        countByJobId(String jobId);
   Page<Application> findByJobIdAndStatusNot(String jobId, ApplicationStatus status, Pageable pageable);
long countByJobIdAndStatusNot(String jobId, ApplicationStatus status);
}