package com.swe6813.team4.authservice.rest;

import com.swe6813.team4.authservice.dao.UserRepo;
import com.swe6813.team4.authservice.model.TokenRequest;
import com.swe6813.team4.authservice.model.User;
import com.swe6813.team4.authservice.rest.exception.BadInputException;
import com.swe6813.team4.authservice.rest.exception.UserNotFoundException;
import com.swe6813.team4.authservice.rest.exception.UsernameTakenException;
import com.swe6813.team4.authservice.util.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
  private final UserRepo userRepo;
  private final PasswordEncoder passwordEncoder;

  @Autowired
  public AuthController(UserRepo userRepo, PasswordEncoder passwordEncoder) {
    this.userRepo = userRepo;
    this.passwordEncoder = passwordEncoder;
  }

  @PostMapping(path="/register")
  public ResponseEntity<User> register(@RequestBody User user) {
    if (user.getUsername() == null || user.getUsername().trim().isEmpty() || user.getPassword() == null || user.getPassword().trim().isEmpty()) {
      throw new BadInputException("Request body must include username and password");
    }

    if (user.getId() != 0) {
      user.setId(0);
    }

    // should fail if user with name already exists
    if (userRepo.findOneByUsername(user.getUsername()) != null) {
      throw new UsernameTakenException(String.format("Username '%s' is already taken", user.getUsername()));
    }

    user.setPassword(passwordEncoder.encode(user.getPassword()));
    User savedUser = userRepo.save(user);

    // TODO: replace with a client-safe DTO
    savedUser.setPassword(null);

    String token = TokenUtil.generateToken(user.getId());

    return ResponseEntity.status(HttpStatus.CREATED)
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
        .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Authorization")
        .body(savedUser);
  }

  @PostMapping(path="/login")
  public ResponseEntity<User> login(@RequestBody User user) {
    if (user.getUsername() == null || user.getUsername().trim().isEmpty() || user.getPassword() == null || user.getPassword().trim().isEmpty()) {
      throw new BadInputException("Request body must include username and password");
    }

    User foundUser = userRepo.findOneByUsername(user.getUsername());

    if (foundUser == null || !BCrypt.checkpw(user.getPassword(), foundUser.getPassword())) {
      throw new UserNotFoundException("Invalid username and password");
    }

    // TODO: replace with a client-safe DTO
    foundUser.setPassword(null);
    String token = TokenUtil.generateToken(foundUser.getId());

    return ResponseEntity.status(HttpStatus.OK)
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
        .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Authorization")
        .body(foundUser);
  }

  @PostMapping(path="validate-token")
  public ResponseEntity<Boolean> validateToken(@RequestBody TokenRequest tokenRequest) {
    return ResponseEntity.ok(TokenUtil.validateToken(tokenRequest.token()));
  }
}
