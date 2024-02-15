package com.swe6813.team4.authservice.rest;

public class BadInputException extends RuntimeException {
  public BadInputException(String message) {
    super(message);
  }
}
