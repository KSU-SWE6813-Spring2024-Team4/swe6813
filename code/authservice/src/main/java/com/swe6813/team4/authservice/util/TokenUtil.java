package com.swe6813.team4.authservice.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.SecretKey;
import java.util.Date;

public class TokenUtil {
  @Value("${jwt_secret}")
  private String secret;

  private static final long EXPIRY = 1000 * 60 * 60 * 24;

  private SecretKey key;

  public TokenUtil() {}

  @PostConstruct
  public void init() {
    this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
  }

  public String generateToken(int id) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + EXPIRY);
    return Jwts.builder()
        .subject("" + id)
        .issuedAt(now)
        .expiration(expiryDate)
        .signWith(key)
        .compact();
  }

  public boolean validateToken(String token) {
    try {
      Jwts.parser()
          .verifyWith(key)
          .build()
          .parseSignedClaims(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }
}
