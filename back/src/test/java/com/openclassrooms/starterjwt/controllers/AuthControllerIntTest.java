package com.openclassrooms.starterjwt.controllers;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

//Les annotations @SpringBootTest et @AutoConfigureMockMvc permettent de charger le contexte Spring et de réaliser des requêtes sur le controller.
@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ActiveProfiles("test") // Profil test activé indique qu'on utilise la BDD embarquée définie dans
                        // application-test.properties
public class AuthControllerIntTest {
        // MockMVC crée une fausse version de votre application web, et lance les
        // méthodes qu’il comprend, afin que la fonctionnalité de votre application ne
        // soit pas interrompue
        @Autowired
        MockMvc mockMvc;

        @Test
        @DisplayName("Test authenticate user Admin OK")
        public void testAuthenticateUserAdmin() throws Exception {
                String requestBodyAdmin = "{" +
                                "    \"email\": \"yoga@studio.com\"," +
                                "    \"password\": \"test!1234\"" +
                                "}";
                MvcResult result = mockMvc.perform(post("/api/auth/login") // Post vers /api/auth/login
                                .contentType(MediaType.APPLICATION_JSON) // Contenu de type JSON
                                .content(requestBodyAdmin)) // La requestBody déclarée plus haut
                                .andExpect(status().isOk()) // ASSERT : On attend du OK en retour
                                .andReturn();
                // ASSERT : Dans la response, au niveau du Json , on attend "admin": true
                assertTrue(result.getResponse().getContentAsString().contains("\"admin\":true"));
        }

        @Test
        @DisplayName("Test register user OK")
        public void testRegisterUserOK() throws Exception {
                String requestBodyRegisterUser = "{" +
                                "    \"lastName\": \"tata\"," +
                                "    \"firstName\": \"tutu\"," +
                                "    \"email\": \"tutu@gmail.com\"," +
                                "    \"password\": \"test!1234\"" +
                                "}";
                MvcResult result = mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBodyRegisterUser))
                                .andExpect(status().isOk())
                                .andReturn();
                assertTrue(result.getResponse().getContentAsString().contains("User registered successfully!"));
        }

        @Test
        @DisplayName("Test authenticate user OK")
        public void testAuthenticateUser() throws Exception {
                String requestBodyUser = "{" +
                                "    \"email\": \"toto@gmail.com\"," +
                                "    \"password\": \"test!1234\"" +
                                "}";
                MvcResult result = mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBodyUser))
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
                String requestBodyRegisterUserAlreadyTaken = "{" +
                                "    \"lastName\": \"toto\"," +
                                "    \"firstName\": \"titi\"," +
                                "    \"email\": \"toto@gmail.com\"," +
                                "    \"password\": \"test!1234\"" +
                                "}";
                MvcResult result = mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBodyRegisterUserAlreadyTaken))
                                .andExpect(status().isBadRequest())
                                .andReturn();
                assertTrue(result.getResponse().getContentAsString().contains("Error: Email is already taken!"));
        }

}
