package com.openclassrooms.starterjwt.controllers;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

//Les annotations @SpringBootTest et @AutoConfigureMockMvc permettent de charger le contexte Spring et de réaliser des requêtes sur le controller.
@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class SessionControllerIntTest {
    // MockMVC crée une fausse version de votre application web, et lance les
    // méthodes qu’il comprend, afin que la fonctionnalité de votre application ne
    // soit pas interrompue
    @Autowired
    MockMvc mockMvc;

    String token;

    String requestBodySession1 = "{" + //
            "    \"name\": \"Séance pour les débutants\"," +
            "    \"date\": \"2012-01-01\"," +
            "    \"teacher_id\": 1," +
            "    \"users\": null," +
            "    \"description\": \"Séance pour les débutants\"" +
            "}";
    String requestBodySession2 = "{" + //
            "    \"name\": \"Séance avancée\"," +
            "    \"date\": \"2012-01-01\"," +
            "    \"teacher_id\": 2," +
            "    \"users\": null," +
            "    \"description\": \"Séance pour les confirmés\"" +
            "}";

    @BeforeAll
    // On récupère un token pour les appels suivants
    public void getValidToken() throws Exception {
        String requestBodyAdmin = "{" +
                "    \"email\": \"yoga@studio.com\"," +
                "    \"password\": \"test!1234\"" +
                "}";
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBodyAdmin))
                .andExpect(status().isOk())
                .andReturn();

        this.token = "Bearer " + JsonPath.read(result.getResponse().getContentAsString(), "$.token");
    }

    @Test
    @DisplayName("Test create et retourne une session")
    public void testCreate() throws Exception {
        mockMvc.perform(post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", this.token)
                        .content(requestBodySession1))
                .andExpect(status().isOk())
                .andReturn();
    }

    @Test
    @DisplayName("Test findById et retourne une session")
    public void testSessionFindById() {

    }

    @Test
    @DisplayName("Test findById et retourne Not Found")
    public void testSessionFindByIdNotFound() {

    }

    @Test
    @DisplayName("Test findById et retourne bad request")
    public void testSessionFindByIdBadRequest() {

    }

    @Test
    @DisplayName("Test findAll and retourne une liste de sessions")
    public void testSessionFindAll() {

    }

    @Test
    @DisplayName("Test update et retourne une session à jour")
    public void testUpdate() {

    }

    @Test
    @DisplayName("Test update et retourne Bad Request")
    public void testUpdateBadRequest() {

    }

    @Test
    @DisplayName("Test delete")
    public void testDelete() {

    }

    @Test
    @DisplayName("Test delete et retourne Bad Request")
    public void testDeleteBadRequest() {

    }

    @Test
    @DisplayName("Test delete et retourne Not Found")
    public void testDeleteNotFound() {

    }

    @Test
    @DisplayName("Test participate")
    public void testParticipate() {

    }

    @Test
    @DisplayName("Test participate et retourne Bad Request")
    public void testParticipateBadRequest() {

    }

    @Test
    @DisplayName("Test no longer participate")
    public void testNoLongerParticipate() {

    }

    @Test
    @DisplayName("Test no longer participate et retourne Bad Request")
    public void testNoLongerParticipateBadRequest() {

    }
}
