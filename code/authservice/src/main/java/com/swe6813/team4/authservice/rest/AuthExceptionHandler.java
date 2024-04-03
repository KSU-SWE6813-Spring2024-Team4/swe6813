package com.swe6813.team4.authservice.rest;

import com.swe6813.team4.authservice.rest.exception.BadInputException;
import com.swe6813.team4.authservice.rest.exception.FailedDependencyException;
import com.swe6813.team4.authservice.rest.exception.UserNotFoundException;
import com.swe6813.team4.authservice.rest.exception.UsernameTakenException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class AuthExceptionHandler {
  @ExceptionHandler({BadInputException.class, UserNotFoundException.class, UsernameTakenException.class})
  public ResponseEntity<ErrorResponse> handleException(RuntimeException e) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(e.getMessage()));
  }

  @ExceptionHandler({FailedDependencyException.class})
  public ResponseEntity<ErrorResponse> handleFailedDependencyException(RuntimeException e) {
    return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body(new ErrorResponse(e.getMessage()));
  }
}
