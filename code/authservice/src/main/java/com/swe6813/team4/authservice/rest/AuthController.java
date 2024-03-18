package com.swe6813.team4.authservice.rest;

import com.swe6813.team4.authservice.dao.UserRepo;
import com.swe6813.team4.authservice.model.TokenRequest;
import com.swe6813.team4.authservice.model.User;
import com.swe6813.team4.authservice.model.MainUser;
import com.swe6813.team4.authservice.rest.exception.BadInputException;
import com.swe6813.team4.authservice.rest.exception.UserNotFoundException;
import com.swe6813.team4.authservice.rest.exception.UsernameTakenException;
import com.swe6813.team4.authservice.util.TokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class AuthController {
  @Value("${main_service_url}")
  private String mainServiceUrl;

  private final UserRepo userRepo;
  private final PasswordEncoder passwordEncoder;
  private final TokenUtil tokenUtil;
  private final RestTemplate rest;

  @Autowired
  public AuthController(UserRepo userRepo, PasswordEncoder passwordEncoder, TokenUtil tokenUtil, RestTemplate rest) {
    this.userRepo = userRepo;
    this.passwordEncoder = passwordEncoder;
    this.tokenUtil = tokenUtil;
    this.rest = rest;
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

    String token = tokenUtil.generateToken(user.getId());

    // create user in the main service
    createMainUser(token, savedUser.getUsername());

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
    String token = tokenUtil.generateToken(foundUser.getId());

    return ResponseEntity.status(HttpStatus.OK)
        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
        .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "Authorization")
        .body(foundUser);
  }

  @PostMapping(path="/validate-token")
  public ResponseEntity<Boolean> validateToken(@RequestBody TokenRequest tokenRequest) {
    return ResponseEntity.ok(tokenUtil.validateToken(tokenRequest.token()));
  }
  
  @GetMapping(path="/ping")
  public ResponseEntity<String> ping() {
    String response = "Ping!";
    return ResponseEntity.ok(response);
  }

  private MainUser createMainUser(String token, String name) {
    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", "Bearer " + token);
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
    map.add("name", name);

    HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

    return rest.postForObject(mainServiceUrl + "/user/add", request, MainUser.class);
  }
}
