package com.openclassrooms.starterjwt.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;

@SpringBootTest
public class SessionServiceUnitTest {
    @Mock // Créé un mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks // Créé une instance de la classe et injecte les mocks ci dessus
    private SessionService sessionService;

    private List<Session> sessionList; // beforeEach: créer une liste de session

    private Session session; // beforeEach: créer une session

    @BeforeEach
    public void testCreateTeacherAndSessions() {
        Teacher teacher = new Teacher((long) 1, "DELAHAYE", "Margot", LocalDateTime.parse("2023-08-29T00:00:00"),
                LocalDateTime.parse("2023-08-29T00:00:00"));
        this.session = new Session((long) 1, "Session pour les nouveaux", new Date(),
                "'Session réservée aux nouveaux", teacher, new ArrayList<>(),
                LocalDateTime.parse("2023-10-07T00:00:00"),
                LocalDateTime.parse("2023-10-07T00:00:00"));
        this.sessionList = new ArrayList<>();
        this.sessionList.add(session);
        this.sessionList.add(new Session((long) 2, "Session avancée", new Date(),
                "'Session réservée aux confirmés", teacher, new ArrayList<>(),
                LocalDateTime.parse("2023-10-08T00:00:00"),
                LocalDateTime.parse("2023-10-08T00:00:00")));

    }

    @Test
    @DisplayName("Créer une session (Create)")
    public void testCreate() {
        //ARRANGE : on créé une session et son teacher, et mock de sessionsRepository
        when(sessionRepository.save(session)).thenReturn(session);

        //ACT
        Session SessionCreated = sessionService.create(session);

        //ASSERT : on vérifie que sessionRepository.create a bien été appelé et que la session créée est identique
        assertEquals(session, SessionCreated);
        verify(sessionRepository, times(1)).save(session);

    }

    @Test
    @DisplayName("Supprimer une session (Delete)")
    public void testDelete() {
        // ARRANGE : cf beforeEach pour la création de la session id 1
        // ACT : delete la session 1
        sessionService.delete(1L);
        // ASSERT : on vérifie que userRepository.deleteById a bien été appelé
        verify(sessionRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Trouver toutes les sessions (findAll)")
    public void testFindAll() {
        //ARRANGE : liste de session et mock de SessionRepository
        when(sessionRepository.findAll()).thenReturn(sessionList);

        //ACT : appel à findAll de SessionService
        List<Session> result = sessionService.findAll();

        //ASSERT : on s'attend à retrouver les même objets et on vérifie que
        // SessionRepository a été appelé
        assertEquals(sessionList.get(0), result.get(0));
        assertEquals(sessionList.get(1), result.get(1));
        verify(sessionRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Récupérer une session par son Id (1)")
    public void testFindById() {
        //ARRANGE : un session et mock de sessionRepository
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        //ACT : appel à findBydId de sessionService
        Session resultsession1 = sessionService.getById(1L);

        //ASSERT : on s'attend à retrouver les même objets et on vérifie que
        // sessionRepository a été appelé
        assertEquals(session, resultsession1);
        verify(sessionRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Mettre à jour une session par son Id (update)")
    public void testUpdate() {
        //ARRANGE : un session et mock de sessionRepository
        when(sessionRepository.save(session)).thenReturn(session);

        //ACT : appel à findBydId de sessionService
        Session resultsessionToUpdate = sessionService.update(1L, session);

        //ASSERT : on s'attend à retrouver les même objets et on vérifie que
        // sessionRepository a été appelé
        assertEquals(session, resultsessionToUpdate);
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    @DisplayName("Inscrire un user à une session (Participate)")
    public void testParticipate() {
        // ARRANGE : une session sans user + un user qui va participer et mock de
        // sessionRepository et
        // userRepository
        User user1 = new User((long) 1, "toto@gmail.com", "toto", "titi", "password", false,
                LocalDateTime.parse("2023-08-29T00:00:00"), LocalDateTime.parse("2023-08-29T00:00:00"));
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(sessionRepository.save(session)).thenReturn(session);

        // ACT : appel à participate de sessionService avec les id de session et user
        sessionService.participate(1L, 1L);

        // ASSERT : on s'attend à avoir le user dans la session et à ce que les
        // repository soient appelés
        verify(sessionRepository, times(1)).save(session);
        verify(sessionRepository, times(1)).findById(1L);
        verify(userRepository, times(1)).findById(1L);
        assertTrue(session.getUsers().contains(user1));
    }

    @Test
    @DisplayName("Désinscrire un user à une session (NoLongerParticipate)")
    public void testNoLongerParticipate() {
        // ARRANGE : une session avec user et mock de sessionRepository
        User user1 = new User((long) 1, "toto@gmail.com", "toto", "titi", "password", false,
                LocalDateTime.parse("2023-08-29T00:00:00"), LocalDateTime.parse("2023-08-29T00:00:00"));
        session.getUsers().add(0, user1);
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(sessionRepository.save(session)).thenReturn(session);

        // ACT : appel à participate de sessionService avec les id de session et user
        sessionService.noLongerParticipate(1L, 1L);

        // ASSERT : on s'attend à avoir le user dans la session et à ce que les
        // repository soient appelés
        verify(sessionRepository, times(1)).save(session);
        verify(sessionRepository, times(1)).findById(1L);
        assertFalse(session.getUsers().contains(user1));
    }

    @Test
    @DisplayName("Inscrire un user à une session inexistante")
    public void testParticipateNoSession() {
        //ARRANGE : pas de session lors de l'appel à sessionService.participate
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty()); // ou Optional.empty()
        when(userRepository.findById(1L)).thenReturn(Optional.of(new User()));

        //ASSERT : on s'attend à une exception levée de type NotFoundException lors de l'appel à participate
        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 1L));
    }

    @Test
    @DisplayName("Inscrire un user inexistant à une session")
    public void testParticipateNoUser() {
        //ARRANGE : pas de user lors de l'appel à sessionService.participate
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        //ASSERT : on s'attend à une exception levée de type NotFoundException lors de l'appel à participate
        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 1L));
    }

    @Test
    @DisplayName("Inscrire un user à une session où il est déjà inscrit")
    public void testAlreadyParticipate() {
        // ARRANGE : une session avec user et on veut l'inscrire
        User user1 = new User((long) 1, "toto@gmail.com", "toto", "titi", "password", false,
                LocalDateTime.parse("2023-08-29T00:00:00"), LocalDateTime.parse("2023-08-29T00:00:00"));
        session.getUsers().add(0, user1);
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));

        // ASSERT : on s'attend à une exception levée de type NotFoundException lors de
        // l'appel à participate
        assertThrows(BadRequestException.class, () -> sessionService.participate(1L, 1L));
    }

    @Test
    @DisplayName("Désinscrire un user à une session où il n'est pas inscrit")
    public void testNotAlreadyParticipate() {
        //ARRANGE : on a une session mais sans user et on veut se désincrire
         when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        //ASSERT : on s'attend à une exception de type BadRequestException
        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(1L, 1L));        

    }
}
