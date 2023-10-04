package com.openclassrooms.starterjwt.security.jwt;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Date;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@SpringBootTest
public class JwtUtilsUnitTest {

    @Autowired
    private JwtUtils jwtUtils;

    @Test
    @DisplayName("Génère un token et vérifie la validité")
    public void testGenerateJwtTokenAndValidateJwtToken() {
        // ARRANGE : un user de type userDetailsImpl
        UserDetailsImpl userDetailsImpl = new UserDetailsImpl(2L, "toto@gmail.com", "titi", "toto", false, "test1234!");
        // ACT : on génère le toke
        String token = jwtUtils.generateJwtToken(new UsernamePasswordAuthenticationToken(userDetailsImpl, null));
        // ASSERT : on le décode pour vérifier la validité
        assertTrue(jwtUtils.validateJwtToken(token));
    }

    @Test
    @DisplayName("Test validateJwtToken et retourne une SignatureException")
    public void testValidateJwtTokenSignatureException() {
        // ARRANGE : on construit un token (à l'instar de JwtUtils.generateJwtToken)
        // avec un mauvais secret
        String token = Jwts.builder()
                .setSubject(("toto@gmail.com"))
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + 86400000))
                .signWith(SignatureAlgorithm.HS512, "wrongSecret")
                .compact();
        // ASERT : le token est invalide
        assertFalse(jwtUtils.validateJwtToken(token));
    }

    @Test
    @DisplayName("Test validateJwtToken et retourne une ExpiredJwtException")
    public void testValidateJwtTokenExpiredJwtException() {
        // ARRANGE : on construit un token (à l'instar de JwtUtils.generateJwtToken)
        // avec une expiration dépassée
        String token = Jwts.builder()
                .setSubject(("toto@gmail.com"))
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() - 1))
                .signWith(SignatureAlgorithm.HS512, "openclassrooms")
                .compact();
        // ASERT : le token est invalide
        assertFalse(jwtUtils.validateJwtToken(token));
    }

    @Test
    @DisplayName("Test validateJwtToken et retourne une MalformedJwtException")
    public void testValidateJwtTokenMalformedJwtException() {
        // ASERT : le token est invalide
        assertFalse(jwtUtils.validateJwtToken("wrongToken"));
    }

    @Test
    @DisplayName("Test validateJwtToken et retourne une IllegalArgumentException")
    public void testValidateJwtTokenIllegalArgumentException() {
        // ASERT : le token est invalide
        assertFalse(jwtUtils.validateJwtToken(""));
    }

}
