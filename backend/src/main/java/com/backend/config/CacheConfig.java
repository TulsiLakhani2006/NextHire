package com.backend.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {
    // If there's no CacheManager auto-configured (e.g. Redis not available),
    // provide a simple in-memory CacheManager so @Cacheable works.
    @Bean
    @ConditionalOnMissingBean(CacheManager.class)
    public CacheManager cacheManager() {
        // Register known cache names used by the app to avoid dynamic creation surprises
        return new ConcurrentMapCacheManager("recruiterAnalytics");
    }
}