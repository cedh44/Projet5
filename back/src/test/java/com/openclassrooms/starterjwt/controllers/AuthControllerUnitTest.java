package com.openclassrooms.starterjwt.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

@SpringBootTest
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
    public void testAuthenticateUserOK() {
        // ARRANGE
        Long id = 1L;
        String email = "yoga@studio.com";
        String password = "test!1234";
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
        // on s'attend à un status OK en retour et les champs suivant identiques en
        // retour
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        assertEquals(jwt, jwtResponse != null ? jwtResponse.getToken() : null);
        assertEquals(id, jwtResponse != null ? jwtResponse.getId() : null);
        assertEquals(email, jwtResponse != null ? jwtResponse.getUsername() : null);
        assertEquals(firstname, jwtResponse != null ? jwtResponse.getFirstName() : null);
        assertEquals(lastname, jwtResponse != null ? jwtResponse.getLastName() : null);
        assertEquals(isAdmin, jwtResponse != null ? jwtResponse.getAdmin() : null);
    }

    @Test
    @DisplayName("Test register user succesfully")
    public void testRegisterUserSuccesfully() {
        // ARRANGE
        String email = "toto@gmail.com";
        String password = "toto123!";
        String lastName = "toto";
        String firstName = "titi";
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail(email);
        signupRequest.setPassword(password);
        signupRequest.setLastName(lastName);
        signupRequest.setFirstName(firstName);

        // On mock userRepository et passwordEncoder
        when(userRepository.existsByEmail(email)).thenReturn(false);
        when(passwordEncoder.encode(password)).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenReturn(new User());

        // ACT
        ResponseEntity<?> response = authController.registerUser(signupRequest);
        MessageResponse messageResponse = (MessageResponse) response.getBody();

        // ASSERT on s'attend à un status OK en retour et le message succesfully
        assertEquals("User registered successfully!", messageResponse != null ? messageResponse.getMessage() : null);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @DisplayName("Test register email already taken")
    public void testRegisterEmailAlreaydTaken() {
        // ARRANGE
        String email = "toto@gmail.com";
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail(email);

        // On mock userRepository et passwordEncoder
        when(userRepository.existsByEmail(email)).thenReturn(true);

        // ACT
        ResponseEntity<?> response = authController.registerUser(signupRequest);
        MessageResponse messageResponse = (MessageResponse) response.getBody();

        // ASSERT on s'attend à un status BAD REQUEST en retour et le message d'erreur
        assertEquals("Error: Email is already taken!", messageResponse != null ? messageResponse.getMessage() : null);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

}
