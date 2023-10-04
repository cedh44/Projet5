package com.openclassrooms.starterjwt.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;

@SpringBootTest
public class TeacherControllerUnitTest {

        @Mock
        private TeacherMapper teacherMapper;
        @Mock
        private TeacherService teacherService;
        @InjectMocks // Créé une instance de la classe et injecte les mocks ci dessus
        private TeacherController teacherController;

        @Test
        @DisplayName("Test findById et retourne un teacher")
        public void testTeacherFindByIdFound() {
                // ARRANGE : on prépare un teacher et mock de teacherService et teacherMapper
                // pour le dto
                Long id = 1L;
                Teacher teacher = new Teacher(id, "DELAHAYE", "Margot", LocalDateTime.parse("2023-08-29T00:00:00"),
                                LocalDateTime.parse("2023-08-29T00:00:00"));
                TeacherDto teacherDto = new TeacherDto(id, "DELAHAYE", "Margot",
                                LocalDateTime.parse("2023-08-29T00:00:00"),
                                LocalDateTime.parse("2023-08-29T00:00:00"));
                when(teacherService.findById(id)).thenReturn(teacher);
                when(teacherMapper.toDto(teacher)).thenReturn(teacherDto);
                // ACT
                ResponseEntity<?> response = teacherController.findById(id.toString());

                TeacherDto teacherDtoBody = (TeacherDto) response.getBody();

                // ASSERT
                assertEquals(HttpStatus.OK, response.getStatusCode());
                assertEquals(teacher.getId(), teacherDtoBody != null ? teacherDtoBody.getId() : null);
                assertEquals(teacher.getLastName(), teacherDtoBody != null ? teacherDtoBody.getLastName() : null);
                assertEquals(teacher.getFirstName(), teacherDtoBody != null ? teacherDtoBody.getFirstName() : null);
                assertEquals(teacher.getCreatedAt(), teacherDtoBody != null ? teacherDtoBody.getCreatedAt() : null);
                assertEquals(teacher.getUpdatedAt(), teacherDtoBody != null ? teacherDtoBody.getUpdatedAt() : null);
        }

        @Test
        @DisplayName("Test findById et retourne Not Found")
        public void testTeacherFindByIdNotFound() {
                // ARRANGE : mock de teacherService qui retourne null
                Long id = 1L;
                when(teacherService.findById(id)).thenReturn(null);

                // ACT
                ResponseEntity<?> response = teacherController.findById(id.toString());

                // ASSERT on s'attend à ce que le code retour soit NOT_FOUND
                assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        }

        @Test
        @DisplayName("Test findById et retourne BAD_REQUEST")
        public void testTeacherFindByIdBadRequest() {
                // ACT : on passe un id qui n'est pas un nombre
                ResponseEntity<?> response = teacherController.findById("toto");

                // ASSERT on s'attend à ce que le code retour soit NOT_FOUND
                assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        }

        @Test
        @SuppressWarnings("unchecked")
        @DisplayName("Test findAll et retourne une liste de Teachers")
        public void testTeacherFindAll() {
                // ARRANGE : on prépare une liste de teachers, une liste de dtoTeachers et mock
                // de teacherRepository et teacherMapper
                List<Teacher> teachersList = new ArrayList<Teacher>();
                teachersList.add(new Teacher((long) 1, "DELAHAYE", "Margot", LocalDateTime.parse("2023-08-29T00:00:00"),
                                LocalDateTime.parse("2023-08-29T00:00:00")));
                teachersList.add(new Teacher((long) 2, "THIERCELIN", "Hélène",
                                LocalDateTime.parse("2023-08-29T00:00:00"),
                                LocalDateTime.parse("2023-08-29T00:00:00")));
                List<TeacherDto> dtoTeachersList = new ArrayList<>();
                dtoTeachersList.add(new TeacherDto((long) 1, "DELAHAYE", "Margot",
                                LocalDateTime.parse("2023-08-29T00:00:00"),
                                LocalDateTime.parse("2023-08-29T00:00:00")));
                dtoTeachersList.add(new TeacherDto((long) 2, "THIERCELIN", "Hélène",
                                LocalDateTime.parse("2023-08-29T00:00:00"),
                                LocalDateTime.parse("2023-08-29T00:00:00")));

                when(teacherService.findAll()).thenReturn(teachersList);
                when(teacherMapper.toDto(teachersList)).thenReturn(dtoTeachersList);

                // ACT
                ResponseEntity<?> response = teacherController.findAll();

                List<TeacherDto> dtoTeachersListBody = (List<TeacherDto>) response.getBody();

                // ASSERT : on vérfie le code status, size et les id des listes
                assertEquals(HttpStatus.OK, response.getStatusCode());
                assertEquals(teachersList.size(), dtoTeachersListBody != null ? dtoTeachersListBody.size() : 0);
                assertEquals(teachersList.get(0).getId(),
                                dtoTeachersListBody != null ? dtoTeachersListBody.get(0).getId() : null);
                assertEquals(teachersList.get(1).getId(),
                                dtoTeachersListBody != null ? dtoTeachersListBody.get(1).getId() : null);

        }

}
