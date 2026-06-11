package com.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.backend.model.Profile;

public interface ProfileRepository extends MongoRepository<Profile, String> {
    Optional<Profile> findByUserId(String userId);
    List<Profile> findByIsPublicTrue();                          // for recruiter search
    List<Profile> findBySkillsContainingAndIsPublicTrue(String skill); // skill-based search
}