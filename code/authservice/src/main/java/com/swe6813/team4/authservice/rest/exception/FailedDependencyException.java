package com.swe6813.team4.authservice.rest.exception;

public class FailedDependencyException extends RuntimeException {
  public FailedDependencyException(String message) {
    super(message);
  }
}
