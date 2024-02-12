package com.swe6813.team4.authservice;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
  @GetMapping(path="/login")
  public String login() {
    return "work in progress";
  }
}
