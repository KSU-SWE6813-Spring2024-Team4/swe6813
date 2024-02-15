package com.swe6813.team4.authservice.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swe6813.team4.authservice.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTests {
  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  void loginFailsForBadCredentials() {
  }

  @Test
  void loginFailsForNonexistentUser() {
  }

  @Test
  void loginSucceeds() {}

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
  void registerSucceeds() {
  }
}
