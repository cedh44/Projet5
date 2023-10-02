package com.openclassrooms.starterjwt.controllers;

import static org.hamcrest.Matchers.is;
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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.jayway.jsonpath.JsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class TeacherControllerIntTest {
        @Autowired
        MockMvc mockMvc;

        String token;

        @BeforeAll
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
        @DisplayName("Test find teacher by Id")
        public void testFindTeacherById() throws Exception {
                mockMvc.perform(get("/api/teacher/1")
                                .header("Authorization", this.token))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("lastName", is("DELAHAYE")));

        }

        @Test
        @DisplayName("Test find teacher by Id Not Found")
        public void testFindTeacherByIdNotFound() throws Exception {
                mockMvc.perform(get("/api/teacher/99")
                                .header("Authorization", this.token))
                                .andExpect(status().isNotFound());
        }

        @Test
        @DisplayName("Test find teacher by Id Bad Request")
        public void testFindTeacherByIdBadRequest() throws Exception {
                mockMvc.perform(get("/api/teacher/toto")
                                .header("Authorization", this.token))
                                .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("Test find all teachers")
        public void testFindAllTeachers() throws Exception {
                mockMvc.perform(get("/api/teacher/")
                                .header("Authorization", this.token))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$[0].id").value(1))
                                .andExpect(jsonPath("$[0].lastName", is("DELAHAYE")))
                                .andExpect(jsonPath("$[1].id").value(2))
                                .andExpect(jsonPath("$[1].lastName", is("THIERCELIN")));
        }

}
