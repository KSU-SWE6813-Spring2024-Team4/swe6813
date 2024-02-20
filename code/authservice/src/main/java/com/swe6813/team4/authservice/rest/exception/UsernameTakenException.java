package com.swe6813.team4.authservice.rest.exception;

public final class UsernameTakenException extends RuntimeException {
  public UsernameTakenException(String message) {
    super(message);
  }
}
