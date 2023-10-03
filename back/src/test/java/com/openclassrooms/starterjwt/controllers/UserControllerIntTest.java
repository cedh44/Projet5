package com.openclassrooms.starterjwt.controllers;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@ActiveProfiles("test") //Profil test activé indique qu'on utilise la BDD embarquée définie dans application-test.properties
public class UserControllerIntTest {
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
                this.token = "Bearer "
                                + JsonPath.read(resultLogin.getResponse().getContentAsString(), "$.token");
                this.id = JsonPath.read(resultLogin.getResponse().getContentAsString(), "$.id");
        }

        @Test
        @DisplayName("Test find user by Id")
        public void testFindUserById() throws Exception {
                mockMvc.perform(get("/api/user/" + this.id)
                                .header("Authorization", this.token))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("lastName", is("toto")));
        }

        @Test
        @DisplayName("Test findById et retourne Not Found")
        public void testUserFindByIdNotFound() throws Exception {
                mockMvc.perform(get("/api/user/99999")
                                .header("Authorization", this.token))
                                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("Test findById et retourne Bad Request")
        public void testUserFindByIdBadRequest() throws Exception {
                mockMvc.perform(get("/api/user/toto")
                                .header("Authorization", this.token))
                                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Test findById et retourne Unauthorized")
        public void testUserFindByIdUnauthorized() throws Exception {
                mockMvc.perform(get("/api/user/" + this.id)
                                .header("Authorization", "WrongToken"))
                                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Test delete OK")
        public void testDeleteUserOK() throws Exception {
                mockMvc.perform(delete("/api/user/" + this.id)
                                .header("Authorization", this.token))
                                .andExpect(status().isOk());
        }
        
        @Test
        @DisplayName("Test delete un user inexistant et retourne Not Found")
        public void testDeleteNotFound() throws Exception {
                mockMvc.perform(delete("/api/user/99999")
                                .header("Authorization", this.token))
                                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("Test delete un user et retourne Bad Request")
        public void testDeleteBadRequest() throws Exception {
                mockMvc.perform(delete("/api/user/toto")
                                .header("Authorization", this.token))
                                .andExpect(status().isBadRequest());
        }
}
