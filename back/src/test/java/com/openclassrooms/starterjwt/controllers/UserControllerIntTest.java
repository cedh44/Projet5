package com.openclassrooms.starterjwt.controllers;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.AfterAll;
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

import com.jayway.jsonpath.JsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class UserControllerIntTest {
        @Autowired
        MockMvc mockMvc;

        String token;
        int id;

        @BeforeAll
        public void registerUserAndLoginAndGetValidToken() throws Exception {
                String requestBodyRegisterUser = "{" +
                                "    \"lastName\": \"toto\"," +
                                "    \"firstName\": \"titi\"," +
                                "    \"email\": \"toto@gmail.com\"," +
                                "    \"password\": \"test123!\"" +
                                "}";
                String requestBodyLoginUser = "{" +
                                "    \"email\": \"toto@gmail.com\"," +
                                "    \"password\": \"test123!\"" +
                                "}";
                mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBodyRegisterUser))
                                .andExpect(status().isOk());
                MvcResult result = mockMvc.perform(post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBodyLoginUser))
                                .andExpect(status().isOk())
                                .andReturn();
                this.token = "Bearer " + JsonPath.read(result.getResponse().getContentAsString(), "$.token");
                this.id = JsonPath.read(result.getResponse().getContentAsString(), "$.id");
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
                mockMvc.perform(get("/api/user/99")
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
        @DisplayName("Test delete un user inexistant et retourne Not Found")
        public void testDeleteNotFound() throws Exception {
                mockMvc.perform(delete("/api/user/99")
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


        @AfterAll
        public void testDeleteUserOK() throws Exception {
                // Supprimer le user en BDD
                mockMvc.perform(delete("/api/user/" + this.id)
                                .header("Authorization", this.token))
                                .andExpect(status().isOk());
        }

}
