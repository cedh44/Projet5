package com.openclassrooms.starterjwt.controllers;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.jayway.jsonpath.JsonPath;

//Les annotations @SpringBootTest et @AutoConfigureMockMvc permettent de charger le contexte Spring et de réaliser des requêtes sur le controller.
@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class AuthControllerIntTest {
    // MockMVC crée une fausse version de votre application web, et lance les
    // méthodes qu’il comprend, afin que la fonctionnalité de votre application ne
    // soit pas interrompue
    @Autowired
    MockMvc mockMvc;

    String requestBodyAdmin = "{" +
            "    \"email\": \"yoga@studio.com\"," +
            "    \"password\": \"test!1234\"" +
            "}";

    String requestBodyUser = "{" +
            "    \"email\": \"toto@gmail.com\"," +
            "    \"password\": \"test123!\"" +
            "}";
    String requestBodyRegisterUser = "{" +
            "    \"lastName\": \"toto\"," +
            "    \"firstName\": \"titi\"," +
            "    \"email\": \"toto@gmail.com\"," +
            "    \"password\": \"test123!\"" +
            "}";

    @Test
    @DisplayName("Test authenticate user Admin OK")
    public void testAuthenticateUserAdmin() throws Exception {

        MvcResult result = mockMvc.perform(post("/api/auth/login") // Post vers /api/auth/login
                .contentType(MediaType.APPLICATION_JSON) // Contenu de type JSON
                .content(this.requestBodyAdmin)) // La requestBody déclarée plus haut
                .andExpect(status().isOk()) // ASSERT : On attend du OK en retour
                .andReturn();
        // ASSERT : Dans la response, au niveau du Json , on attend "admin": true
        assertTrue(result.getResponse().getContentAsString().contains("\"admin\":true"));
    }

    @Test
    @DisplayName("Test register user OK")
    public void testRegisterUserKO() throws Exception {

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(this.requestBodyRegisterUser))
                .andExpect(status().isOk())
                .andReturn();
        assertTrue(result.getResponse().getContentAsString().contains("User registered successfully!"));
    }

    @Test
    @DisplayName("Test authenticate user OK")
    public void testAuthenticateUser() throws Exception {

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(this.requestBodyUser))
                .andExpect(status().isOk())
                .andReturn();
        assertTrue(result.getResponse().getContentAsString().contains("\"admin\":false"));
    }

    @Test
    @DisplayName("Test authenticate user KO")
    public void testAuthenticateUserKO() throws Exception {
            String requestBodyWithWrongPassword = "{" +
            "    \"email\": \"toto@gmail.com\"," +
            "    \"password\": \"wrongpassword\"" +
            "}";
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBodyWithWrongPassword))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Test register user already taken")
    public void testRegisterUserAlreadyTaken() throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(this.requestBodyRegisterUser))
                .andExpect(status().isBadRequest())
                .andReturn();
        assertTrue(result.getResponse().getContentAsString().contains("Error: Email is already taken!"));
    }

    @AfterAll
    public void cleanUser() throws Exception {
        // Récupérer l'id du user créé et le token
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(this.requestBodyUser))
                .andExpect(status().isOk())
                .andReturn();
        String content = result.getResponse().getContentAsString();
        String token = JsonPath.read(content, "$.token");
        int id = JsonPath.read(content, "$.id");

        // Supprimer le user en BDD
        mockMvc.perform(delete("/api/user/" + id)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

}