package com.openclassrooms.starterjwt.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

import antlr.Token;

@ExtendWith(MockitoExtension.class)
public class AuthControllerUnitTest {

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtUtils jwtUtils;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private UserRepository userRepository;
    @InjectMocks // Créé une instance de la classe et injecte les mocks ci dessus
    private AuthController authController;

    @Test
    @DisplayName("Test authenticate user OK")
    public void testauthenticateUserOK() {
        // ARRANGE
        Long id = 1L;
        String email = "yoga@studio.com";
        String password = "test1234!";
        String firstname = "Admin";
        String lastname = "Admin";
        boolean isAdmin = true;
        String jwt = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5b2dhQHN0dWRpby5jb20iLCJpYXQiOjE2OTYxOTA1MDEsImV4cCI6MTY5NjI3NjkwMX0.KoJbrWNkFChO8_OYxwyrBlRu0vE3OgHr_kgSaFIqTJaDhZUbBfyqAM0g7HZ5auGFPv7TLFotREIIRwZeMG6rmw";
        // On prépare les objets :
        // loginRequest
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);
        // userDetailsImpl
        UserDetailsImpl userDetailsImpl = UserDetailsImpl
                .builder()
                .username(email)
                .firstName(firstname)
                .lastName(lastname)
                .id(id)
                .password(password)
                .build();
        // authentication
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userDetailsImpl, null);

        // On mock authenticationManager, jwtUtils et userRepository
        when(authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())))
                .thenReturn(authentication);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn(jwt);
        when(userRepository.findByEmail(userDetailsImpl.getUsername()))
                .thenReturn(Optional.of(new User(id, email, lastname, firstname, password, isAdmin, null, null)));

        // ACT
        ResponseEntity<?> responseEntity = authController.authenticateUser(loginRequest);

        // On récupère le jwtResponse dans le body
        JwtResponse jwtResponse = (JwtResponse) responseEntity.getBody();

        // ASSERT
        assertEquals(responseEntity.getStatusCode(), HttpStatus.OK);
        assertEquals(jwtResponse.getToken(), jwt);
        assertEquals(jwtResponse.getId(), id);
        assertEquals(jwtResponse.getUsername(), email);
        assertEquals(jwtResponse.getFirstName(), firstname);
        assertEquals(jwtResponse.getLastName(), lastname);
        assertEquals(jwtResponse.getAdmin(), isAdmin);
    }

}
