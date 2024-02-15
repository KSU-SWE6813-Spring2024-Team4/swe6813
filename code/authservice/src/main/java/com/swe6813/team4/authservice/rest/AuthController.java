package com.swe6813.team4.authservice.rest;

import com.swe6813.team4.authservice.dao.UserRepo;
import com.swe6813.team4.authservice.model.TokenRequest;
import com.swe6813.team4.authservice.model.User;
import com.swe6813.team4.authservice.util.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
  private final UserRepo userRepo;

  @Autowired
  public AuthController(UserRepo userRepo) {
    this.userRepo = userRepo;
  }

  @PostMapping(path="/register")
  public ResponseEntity<User> register(@RequestBody User user) {
    if (user.getUsername().trim().isEmpty() || user.getPassword().trim().isEmpty()) {
      throw new BadInputException("Request body must include username and password");
    }

    if (userRepo.findOneByUsername(user.getUsername()) != null) {
//      throw new RegistrationException();
    }

    User savedUser = userRepo.save(user);
    String token = TokenUtil.generateToken(user.getId());

    return ResponseEntity.status(HttpStatus.CREATED)
        .header("Authorization", "Bearer " + token)
        .body(savedUser);
  }

  @PostMapping(path="/login")
  public String login(@RequestBody User user) {
    if (user.getUsername().trim().isEmpty() || user.getPassword().trim().isEmpty()) {
    }

    User foundUser = userRepo.findOneByUsernameAndPassword(user.getUsername(), "");

    if (foundUser == null) {}

    return "work in progress";
  }

  @PostMapping(path="validate-token")
  public ResponseEntity<Boolean> validateToken(@RequestBody TokenRequest tokenRequest) {
    return ResponseEntity.ok(TokenUtil.validateToken(tokenRequest.token()));
  }
}
