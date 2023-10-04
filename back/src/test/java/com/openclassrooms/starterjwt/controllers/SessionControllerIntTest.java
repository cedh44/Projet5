package com.openclassrooms.starterjwt.controllers;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeAll;
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

import com.jayway.jsonpath.JsonPath;

//Les annotations @SpringBootTest et @AutoConfigureMockMvc permettent de charger le contexte Spring et de réaliser des requêtes sur le controller.
@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ActiveProfiles("test") // Profil test activé indique qu'on utilise la BDD embarquée définie dans
                        // application-test.properties
public class SessionControllerIntTest {
        // MockMVC crée une fausse version de votre application web, et lance les
        // méthodes qu’il comprend, afin que la fonctionnalité de votre application ne
        // soit pas interrompue
        @Autowired
        MockMvc mockMvc;

        String token;
        int id;

        @BeforeAll
        // on récupère id et token depuis un login
        public void getValidToken() throws Exception {
                String requestBodyLoginUser = "{" +
                                "    \"email\": \"toto@gmail.com\"," +
                                "    \"password\": \"test!1234\"" +
                                "}";
                MvcResult resultLogin = mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBodyLoginUser))
                                .andReturn();
                token = "Bearer "
                                + JsonPath.read(resultLogin.getResponse().getContentAsString(), "$.token");
                id = JsonPath.read(resultLogin.getResponse().getContentAsString(), "$.id");
        }

        @Test
        @DisplayName("Test create et retourne une session à chaque fois")
        public void testCreate() throws Exception {
                String requestBodySession = "{" + //
                                "    \"name\": \"Session pour les enfants\"," +
                                "    \"date\": \"2012-01-01\"," +
                                "    \"teacher_id\": 1," +
                                "    \"users\": null," +
                                "    \"description\": \"Session pour les enfants\"" +
                                "}";
                mockMvc.perform(post("/api/session")
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", token)
                                .content(requestBodySession))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("name", is("Session pour les enfants")));
        }

        @Test
        @DisplayName("Test findById et retourne une session")
        public void testSessionFindById() throws Exception {
                mockMvc.perform(get("/api/session/1")
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", token))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("name", is("Session pour les nouveaux")));
        }

        @Test
        @DisplayName("Test findById et retourne Not Found")
        public void testSessionFindByIdNotFound() throws Exception {
                mockMvc.perform(get("/api/sesson/99999")
                                .header("Authorization", token))
                                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("Test findById et retourne bad request")
        public void testSessionFindByIdBadRequest() throws Exception {
                mockMvc.perform(get("/api/session/toto")
                                .header("Authorization", token))
                                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Test findAll and retourne une liste de sessions")
        public void testSessionFindAll() throws Exception {
                mockMvc.perform(get("/api/session/")
                                .header("Authorization", token))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$[0].name", is("Session pour les nouveaux")))
                                .andExpect(jsonPath("$[1].name", is("Session junior")));
        }

        @Test
        @DisplayName("Test update et retourne une session à jour")
        public void testUpdate() throws Exception {
                String requestBodySessionUpdate = "{" +
                                "    \"name\": \"Session pour les pros UPDATED\"," +
                                "    \"date\": \"2023-12-01\"," +
                                "    \"teacher_id\": 1," +
                                "    \"users\": null," +
                                "    \"description\": \"Session pour les pros\"" +
                                "}";
                mockMvc.perform(put("/api/session/3")
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", token)
                                .content(requestBodySessionUpdate))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("name", is("Session pour les pros UPDATED")));
        }

        @Test
        @DisplayName("Test update et retourne Bad Request")
        public void testUpdateBadRequest() throws Exception {
                mockMvc.perform(put("/api/session/toto")
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", token)
                                .content(""))
                                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Test delete")
        public void testDelete() throws Exception {
                // Créer une session
                mockMvc.perform(delete("/api/session/4")
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", token))
                                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Test delete et retourne Bad Request")
        public void testDeleteBadRequest() throws Exception {
                mockMvc.perform(delete("/api/session/toto")
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", token))
                                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Test delete et retourne Not Found")
        public void testDeleteNotFound() throws Exception {
                mockMvc.perform(delete("/api/session/99999")
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", token))
                                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("Test participate and no longer participate")
        public void testParticipateAndNoLongerParticipate() throws Exception {
                // Participate
                mockMvc.perform(post("/api/session/1/participate/" + id)
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", token))
                                .andExpect(status().isOk());
                mockMvc.perform(delete("/api/session/1/participate/" + id)
                                // No Longer Participate
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", token))
                                .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Test participate et retourne Bad Request")
        public void testParticipateBadRequest() throws Exception {
                mockMvc.perform(post("/api/session/toto/participate/tata")
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", token))
                                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Test no longer participate et retourne Bad Request")
        public void testNoLongerParticipateBadRequest() throws Exception {
                mockMvc.perform(delete("/api/session/toto/participate/tata")
                                .contentType(MediaType.APPLICATION_JSON)
                                .header("Authorization", token))
                                .andExpect(status().isBadRequest());
        }
}
