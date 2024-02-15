package com.swe6813.team4.authservice.dao;

import com.swe6813.team4.authservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Integer> {
  User findOneByUsername(String username);
}
