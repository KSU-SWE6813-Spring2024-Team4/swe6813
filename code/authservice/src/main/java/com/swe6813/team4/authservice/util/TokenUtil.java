package com.swe6813.team4.authservice.util;

import io.jsonwebtoken.Jwts;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

public class TokenUtil {
  private static final long EXPIRY = 1000 * 60 * 60 * 24;

  private static final Key secret = Jwts.SIG.HS512.key().build();

  public static String generateToken(int id) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + EXPIRY);
    return Jwts.builder().subject("" + id).issuedAt(now).expiration(expiryDate).signWith(secret).compact();
  }

  public static boolean validateToken(String token) {
    try {
      Jwts.parser().verifyWith((SecretKey) secret).build().parseSignedClaims(token);
      return true;
    } catch (Exception e) {
      return false;
    }
  }
}
