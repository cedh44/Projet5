package com.openclassrooms.starterjwt.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceUnitTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    @Test
    @DisplayName("Récupérer la liste des teachers")
    public void testFindAll() {
        //ARRANGE : liste de teachers et mock de teacherRepository
        List<Teacher> teachersList = new ArrayList<Teacher>();
        teachersList.add(new Teacher((long)1, "DELAHAYE", "Margot", LocalDateTime.parse("2023-08-29T00:00:00"), LocalDateTime.parse("2023-08-29T00:00:00")));
        teachersList.add(new Teacher((long)2, "THIERCELIN", "Hélène", LocalDateTime.parse("2023-08-29T00:00:00"), LocalDateTime.parse("2023-08-29T00:00:00")));
        when(teacherRepository.findAll()).thenReturn(teachersList);

        //ACT : appel à findAll de TeacherService
        List<Teacher> result = teacherService.findAll();

        //ASSERT : on s'attend à retrouver les même objets et on vérifie que teacherRepository a été appelé
        assertEquals(teachersList.get(0), result.get(0));
        assertEquals(teachersList.get(1), result.get(1));
        verify(teacherRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Récupérer un teacher par son Id (1)")
    public void testFindById() {
        //ARRANGE : un teacher et mock de teacherRepository
        Teacher teacher1 = new Teacher((long)1, "DELAHAYE", "Margot", LocalDateTime.parse("2023-08-29T00:00:00"), LocalDateTime.parse("2023-08-29T00:00:00"));
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher1));

        //ACT : appel à findBydId de TeacherService
        Teacher resultTeacher1 = teacherService.findById(1L);

        //ASSERT : on s'attend à retrouver les même objets et on vérifie que teacherRepository a été appelé
        assertEquals(teacher1, resultTeacher1);
        verify(teacherRepository, times(1)).findById(1L);
    }

}