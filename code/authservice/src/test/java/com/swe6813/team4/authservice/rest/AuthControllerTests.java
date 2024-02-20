package com.swe6813.team4.authservice.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swe6813.team4.authservice.dao.UserRepo;
import com.swe6813.team4.authservice.model.TokenRequest;
import com.swe6813.team4.authservice.model.User;
import com.swe6813.team4.authservice.util.TokenUtil;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.jdbc.JdbcTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTests {
  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private UserRepo userRepo;

  @Autowired
  private JdbcTemplate jdbcTemplate;

  @AfterEach
  void tearDown() {
    JdbcTestUtils.deleteFromTables(jdbcTemplate, "users");
  }

  @Test
  void loginFailsForBadCredentials() throws Exception {
    User badUser = new User("", "");
    MockHttpServletRequestBuilder req = post("/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(badUser));

    mockMvc.perform(req)
        .andExpect(status().isBadRequest())
        .andExpect(content().json(objectMapper.writeValueAsString(new ErrorResponse("Request body must include username and password"))));
  }

  @Test
  void loginFailsForWrongPassword() throws Exception {
    User user = new User("swe6813", passwordEncoder.encode("swe6813"));
    userRepo.save(user);

    user.setPassword("swe6812");

    MockHttpServletRequestBuilder req = post("/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(user));

    mockMvc.perform(req)
        .andExpect(status().isBadRequest())
        .andExpect(content().json(objectMapper.writeValueAsString(new ErrorResponse("Invalid username and password"))));
  }

  @Test
  void loginFailsForNonexistentUser() throws Exception {
    User badUser = new User("swe6813", "swe6813");
    MockHttpServletRequestBuilder req = post("/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(badUser));

    mockMvc.perform(req)
        .andExpect(status().isBadRequest())
        .andExpect(content().json(objectMapper.writeValueAsString(new ErrorResponse("Invalid username and password"))));
  }

  @Test
  void loginSucceeds() throws Exception {
    User user = new User("swe6813", passwordEncoder.encode("swe6813"));
    userRepo.save(user);

    user.setPassword("swe6813");

    MockHttpServletRequestBuilder req = post("/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(user));

    var res = mockMvc.perform(req).andExpect(status().isOk());

    // ensure that a token is attached to the response headers and is valid
    String authHeader = res.andReturn().getResponse().getHeader("Authorization");
    assertThat(authHeader).isNotNull();

    String token = authHeader.substring(authHeader.indexOf(" ") + 1);
    assertThat(TokenUtil.validateToken(token)).isTrue();
  }

  @Test
  void registerFailsForBadInputs() throws Exception {
    User badUser = new User("", "");
    MockHttpServletRequestBuilder req = post("/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(badUser));

    mockMvc.perform(req)
        .andExpect(status().isBadRequest())
        .andExpect(content().json(objectMapper.writeValueAsString(new ErrorResponse("Request body must include username and password"))));
  }

  @Test
  void registerFailsForTakenUsername() throws Exception {
    User user = new User("swe6813", "swe6813");
    userRepo.save(user);

    MockHttpServletRequestBuilder req = post("/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(user));

    mockMvc.perform(req)
        .andExpect(status().isBadRequest())
        .andExpect(content().json(objectMapper.writeValueAsString(new ErrorResponse(String.format("Username '%s' is already taken", user.getUsername())))));

    assertThat(userRepo.count()).isEqualTo(1);
  }

  @Test
  void registerIgnoresIdIfProvided() throws Exception {
    userRepo.save(new User("swe6813", "swe6813"));

    User user = new User("blah", "blah");
    user.setId(1);

    MockHttpServletRequestBuilder req = post("/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(user));

    mockMvc.perform(req).andExpect(status().isCreated());

    // ensure that the user is saved to the DB
    User savedUser = userRepo.findOneByUsername(user.getUsername());
    assertThat(savedUser).isNotNull();
    assertThat(savedUser.getId()).isNotEqualTo(1);

    assertThat(userRepo.count()).isEqualTo(2);
  }

  @Test
  void registerSucceeds() throws Exception {
    User user = new User("swe6813", "swe6813");
    MockHttpServletRequestBuilder req = post("/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(user));

    var res = mockMvc.perform(req).andExpect(status().isCreated());

    // ensure that the user is saved to the DB
    User savedUser = userRepo.findOneByUsername(user.getUsername());
    assertThat(savedUser).isNotNull();
    assertThat(BCrypt.checkpw(user.getPassword(), savedUser.getPassword())).isTrue();

    // TODO: replace with client-safe DTO
    User expectedReturnedUser = new User(user.getUsername(), null);
    expectedReturnedUser.setId(savedUser.getId());
    res.andExpect(content().json(objectMapper.writeValueAsString(expectedReturnedUser)));

    // ensure that a token is attached to the response headers and is valid
    String authHeader = res.andReturn().getResponse().getHeader("Authorization");
    assertThat(authHeader).isNotNull();

    String token = authHeader.substring(authHeader.indexOf(" ") + 1);
    assertThat(TokenUtil.validateToken(token)).isTrue();
  }

  @Test
  void validateTokenReturnsFalseWhenMalformed() throws Exception {
    TokenRequest tokenRequest = new TokenRequest("malformed");

    MockHttpServletRequestBuilder req = post("/validate-token")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(tokenRequest));

    mockMvc.perform(req).andExpect(status().isOk()).andExpect(content().string(Boolean.toString(false)));
  }

  @Test
  void validateTokenReturnsTrueWhenValid() throws Exception {
    TokenRequest tokenRequest = new TokenRequest(TokenUtil.generateToken(1));

    MockHttpServletRequestBuilder req = post("/validate-token")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(tokenRequest));

    mockMvc.perform(req).andExpect(status().isOk()).andExpect(content().string(Boolean.toString(true)));
  }
}
