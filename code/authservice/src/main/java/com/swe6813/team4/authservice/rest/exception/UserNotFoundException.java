package com.swe6813.team4.authservice.rest.exception;

public final class UserNotFoundException extends RuntimeException {
  public UserNotFoundException(String message) {
    super(message);
  }
}
