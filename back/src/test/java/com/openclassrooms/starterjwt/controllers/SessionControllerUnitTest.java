package com.openclassrooms.starterjwt.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;

@SpringBootTest
public class SessionControllerUnitTest {

        @Mock
        private SessionMapper sessionMapper;
        @Mock
        private SessionService sessionService;
        @InjectMocks // Créé une instance de la classe et injecte les mocks ci dessus
        private SessionController sessionController;

        @Test
        @DisplayName("Test findById et retourne une session")
        public void testSessionFindById() {
                // ARRANGE : on prépare une session, une sessionDto et mock de sessionService et
                // sessionMapper
                // pour le dto
                Long id = 1L;
                Session session = new Session(id, "Session pour les nouveaux", null, null, null, null, null,
                                null);
                SessionDto sessionDto = new SessionDto(id, "Session pour les nouveaux", null, null, null, null,
                                null, null);
                when(sessionService.getById(id)).thenReturn(session);
                when(sessionMapper.toDto(session)).thenReturn(sessionDto);

                // ACT
                ResponseEntity<?> response = sessionController.findById(id.toString());

                SessionDto sessionDtoBody = (SessionDto) response.getBody();

                // ASSERT : on vérfie le code status, et les données de la session dans le body
                assertEquals(HttpStatus.OK, response.getStatusCode());
                assertEquals(session.getId(), sessionDtoBody != null ? sessionDtoBody.getId() : null);
                assertEquals(session.getName(), sessionDtoBody != null ? sessionDtoBody.getName() : null);
        }

        @Test
        @DisplayName("Test findById et retourne Not Found")
        public void testSessionFindByIdNotFound() {
                // ARRANGE : mock de sessionService qui retourne null
                Long id = 1L;
                when(sessionService.getById(id)).thenReturn(null);

                // ACT
                ResponseEntity<?> response = sessionController.findById(id.toString());

                // ASSERT on s'attend à ce que le code retour soit NOT_FOUND
                assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        }

        @Test
        @DisplayName("Test findById et retourne bad request")
        public void testSessionFindByIdBadRequest() {
                // ACT : on passe un id qui n'est pas un nombre
                ResponseEntity<?> response = sessionController.findById("toto");

                // ASSERT on s'attend à ce que le code retour soit BAD REQUEST
                assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        }

        @Test
        @DisplayName("Test findAll and retourne une liste de sessions")
        @SuppressWarnings("unchecked")
        public void testSessionFindAll() {
                // ARRANGE : on prépare une liste de sessions, une liste de dtoSession et mock
                // de sessionRepository et sessionMapper
                List<Session> sessionsList = new ArrayList<>();
                sessionsList.add(new Session((long) 1, "Session pour les nouveaux", null, null, null, null, null,
                                null));
                sessionsList.add(new Session((long) 2, "Session avancée", null, null, null, null, null,
                                null));

                List<SessionDto> dtoSessionsList = new ArrayList<>();
                dtoSessionsList.add(new SessionDto((long) 1, "Session pour les nouveaux", null, null, null, null, null,
                                null));
                dtoSessionsList.add(new SessionDto((long) 2, "Session avancée", null, null, null, null, null, null));

                when(sessionService.findAll()).thenReturn(sessionsList);
                when(sessionMapper.toDto(sessionsList)).thenReturn(dtoSessionsList);

                // ACT
                ResponseEntity<?> response = sessionController.findAll();

                List<SessionDto> dtoSessionsListBody = (List<SessionDto>) response.getBody();

                // ASSERT : on vérfie le code status, size, les id et name des listes
                assertEquals(HttpStatus.OK, response.getStatusCode());
                assertEquals(sessionsList.size(), dtoSessionsListBody != null ? dtoSessionsListBody.size() : 0);
                assertEquals(sessionsList.get(0).getId(),
                                dtoSessionsListBody != null ? dtoSessionsListBody.get(0).getId() : null);
                assertEquals(sessionsList.get(1).getId(),
                                dtoSessionsListBody != null ? dtoSessionsListBody.get(1).getId() : null);
                assertEquals(sessionsList.get(0).getName(),
                                dtoSessionsListBody != null ? dtoSessionsListBody.get(0).getName() : null);
                assertEquals(sessionsList.get(1).getName(),
                                dtoSessionsListBody != null ? dtoSessionsListBody.get(1).getName() : null);

        }

        @Test
        @DisplayName("Test create et retourne une session")
        public void testCreate() {
                // ARRANGE : on prépare une sessionDto à créer, une session créé, une sessionDto
                // créée et mock de sessionService et sessionMapper pour le dto
                Long id = 1L;
                SessionDto sessionDtoToCreate = new SessionDto(id, "Session pour les nouveaux", null, null, null, null,
                                null, null);
                Session sessionCreated = new Session(id, "Session pour les nouveaux", null, null, null, null, null,
                                null);
                SessionDto sessionDtoCreated = new SessionDto(id, "Session pour les nouveaux", null, null, null, null,
                                null, null);
                when(sessionService.create(sessionMapper.toEntity(sessionDtoToCreate))).thenReturn(sessionCreated);
                when(sessionMapper.toDto(sessionCreated)).thenReturn(sessionDtoCreated);
                // ACT
                ResponseEntity<?> response = sessionController.create(sessionDtoToCreate);

                SessionDto sessionDtoBody = (SessionDto) response.getBody();

                // ASSERT : on vérfie le code status, et id et name de la session dans le body
                assertEquals(HttpStatus.OK, response.getStatusCode());
                assertEquals(sessionDtoToCreate.getId(), sessionDtoBody != null ? sessionDtoBody.getId() : null);
                assertEquals(sessionDtoToCreate.getName(), sessionDtoBody != null ? sessionDtoBody.getName() : null);
        }

        @Test
        @DisplayName("Test update et retourne une session à jour")
        public void testUpdate() {
                // ARRANGE : on prépare une sessionDto à mettre à jour, une session à jour, une
                // sessionDto
                // à jour et mock de sessionService et sessionMapper pour le dto
                Long id = 1L;
                SessionDto sessionDtoToUpdate = new SessionDto(id, "Session pour les nouveaux à jour", null, null, null,
                                null,
                                null, null);
                Session sessionUpdated = new Session(id, "Session pour les nouveaux à jour", null, null, null, null,
                                null,
                                null);
                SessionDto sessionDtoUpdated = new SessionDto(id, "Session pour les nouveaux à jour", null, null, null,
                                null,
                                null, null);
                when(sessionMapper.toEntity(sessionDtoToUpdate)).thenReturn(sessionUpdated);
                when(sessionService.update(id, sessionMapper.toEntity(sessionDtoToUpdate))).thenReturn(sessionUpdated);
                when(sessionMapper.toDto(sessionUpdated)).thenReturn(sessionDtoUpdated);

                // ACT
                ResponseEntity<?> response = sessionController.update(id.toString(), sessionDtoToUpdate);

                SessionDto sessionDtoBody = (SessionDto) response.getBody();

                // ASSERT : on vérfie le code status, et id et name de la session dans le body
                assertEquals(HttpStatus.OK, response.getStatusCode());
                assertEquals(sessionDtoToUpdate.getId(), sessionDtoBody != null ? sessionDtoBody.getId() : null);
                assertEquals(sessionDtoToUpdate.getName(), sessionDtoBody != null ? sessionDtoBody.getName() : null);
        }

        @Test
        @DisplayName("Test update et retourne Bad Request")
        public void testUpdateBadRequest() {
                // ACT : on passe un id qui n'est pas un nombre
                ResponseEntity<?> response = sessionController.update("toto", new SessionDto());

                // ASSERT on s'attend à ce que le code retour soit BAD REQUEST
                assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        }

        @Test
        @DisplayName("Test delete")
        public void testDelete() {
                // ARRANGE : on prépare une session et mock de sessionService
                Long id = 1L;
                Session session = new Session(id, "Session pour les nouveaux", null, null, null, null, null,
                                null);
                when(sessionService.getById(id)).thenReturn(session);
                doNothing().when(sessionService).delete(id);

                // ACT
                ResponseEntity<?> response = sessionController.save(id.toString());

                // ASSERT : on vérfie le code status OK
                assertEquals(HttpStatus.OK, response.getStatusCode());
        }

        @Test
        @DisplayName("Test delete et retourne Bad Request")
        public void testDeleteBadRequest() {
                // ACT : on passe un id qui n'est pas un nombre
                ResponseEntity<?> response = sessionController.save("toto");

                // ASSERT : on s'attend à ce que le code retour soit BAD REQUEST
                assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        }

        @Test
        @DisplayName("Test delete et retourne Not Found")
        public void testDeleteNotFound() {
                // ARRANGE : mock de sessionService qui retourne null
                Long id = 1L;
                when(sessionService.getById(id)).thenReturn(null);

                // ACT
                ResponseEntity<?> response = sessionController.save(id.toString());

                // ASSERT : on s'attend à ce que le code retour soit NOT FOUND
                assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        }

        @Test
        @DisplayName("Test participate")
        public void testParticipate() {
                // ARRRANGE : un id et un userId et on mock sessionService Participate
                Long id = 1L;
                Long userId = 1L;
                doNothing().when(sessionService).participate(id, userId);

                // ACT
                ResponseEntity<?> response = sessionController.participate(id.toString(), userId.toString());

                // ASSERT : on vérfie le code status OK
                assertEquals(HttpStatus.OK, response.getStatusCode());
        }

        @Test
        @DisplayName("Test participate et retourne Bad Request")
        public void testParticipateBadRequest() {
                // ACT : on passe un id qui n'est pas un nombr
                ResponseEntity<?> response = sessionController.participate("toto", "titi");

                // ASSERT : on s'attend à ce que le code retour soit BAD REQUEST
                assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        }

        @Test
        @DisplayName("Test no longer participate")
        public void testNoLongerParticipate() {
                // ARRRANGE : un id et un userId et on mock sessionService Participate
                Long id = 1L;
                Long userId = 1L;
                doNothing().when(sessionService).noLongerParticipate(id, userId);

                // ACT
                ResponseEntity<?> response = sessionController.noLongerParticipate(id.toString(), userId.toString());

                // ASSERT : on vérfie le code status OK
                assertEquals(HttpStatus.OK, response.getStatusCode());
        }

        @Test
        @DisplayName("Test no longer participate et retourne Bad Request")
        public void testNoLongerParticipateBadRequest() {
                // ACT : on passe un id qui n'est pas un nombr
                ResponseEntity<?> response = sessionController.noLongerParticipate("toto", "titi");

                // ASSERT : on s'attend à ce que le code retour soit BAD REQUEST
                assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        }

}
