package com.openclassrooms.starterjwt.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("Supprimer un utilisateur (Delete)")
    public void deleteTest() {
        //ACT
        userService.delete(1L);
        //ASSERT : on vérifie que userRepository.deleteById a bien été appelé
        verify(userRepository, times(1)).deleteById(1L);
    }

        @Test
    @DisplayName("Récupérer un user par son Id (1)")
    public void testFindById() {
        //ARRANGE : un user et mock de userRepository
        User user1 = new User((long)1, "toto@gmail.com", "toto", "titi", "password", false, LocalDateTime.parse("2023-08-29T00:00:00"), LocalDateTime.parse("2023-08-29T00:00:00"));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));

        //ACT : appel à findBydId de TeacherService
        User resultUser1 = userService.findById(1L);

        //ASSERT : on s'attend à retrouver les même objets et on vérifie que teacherRepository a été appelé
        assertEquals(user1, resultUser1);
        verify(userRepository, times(1)).findById(1L);
    }

}
