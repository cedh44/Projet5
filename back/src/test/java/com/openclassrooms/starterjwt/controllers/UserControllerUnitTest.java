package com.openclassrooms.starterjwt.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.services.UserService;

@SpringBootTest
public class UserControllerUnitTest {

        @Mock
        private UserMapper userMapper;
        @Mock
        private UserService userService;
        @Mock
        private SecurityContext securityContext;
        @InjectMocks // Créé une instance de la classe et injecte les mocks ci dessus
        private UserController userController;

        @Test
        @DisplayName("Test findById et retourne un user")
        public void testUserFindById() {
                // ARRANGE : on prépare un user, un user Dto et mock de userService et
                // userMapper
                // pour le dto
                Long id = 1L;
                User user = new User(id, "toto@gmail.com", "toto", "titi", "password", false,
                                LocalDateTime.parse("2023-08-29T00:00:00"), LocalDateTime.parse("2023-08-29T00:00:00"));
                UserDto userDto = new UserDto(id, "toto@gmail.com", "toto", "titi", false, "password",
                                LocalDateTime.parse("2023-08-29T00:00:00"), LocalDateTime.parse("2023-08-29T00:00:00"));
                when(userService.findById(id)).thenReturn(user);
                when(userMapper.toDto(user)).thenReturn(userDto);
                // ACT
                ResponseEntity<?> response = userController.findById(id.toString());

                UserDto userDtoBody = (UserDto) response.getBody();

                // ASSERT : on vérfie le code status, et les données du user dans le body
                assertEquals(HttpStatus.OK, response.getStatusCode());
                assertEquals(user.getId(), userDtoBody != null ? userDtoBody.getId() : null);
                assertEquals(user.getEmail(), userDtoBody != null ? userDtoBody.getEmail() : null);
                assertEquals(user.getPassword(), userDtoBody != null ? userDtoBody.getPassword() : null);
                assertEquals(user.getLastName(), userDtoBody != null ? userDtoBody.getLastName() : null);
                assertEquals(user.getFirstName(), userDtoBody != null ? userDtoBody.getFirstName() : null);
                assertEquals(user.getCreatedAt(), userDtoBody != null ? userDtoBody.getCreatedAt() : null);
                assertEquals(user.getUpdatedAt(), userDtoBody != null ? userDtoBody.getUpdatedAt() : null);
        }

        @Test
        @DisplayName("Test findById et retourne Not Found")
        public void testUserFindByIdNotFound() {
                // ARRANGE : mock de userService qui retourne null
                Long id = 1L;
                when(userService.findById(id)).thenReturn(null);

                // ACT
                ResponseEntity<?> response = userController.findById(id.toString());

                // ASSERT on s'attend à ce que le code retour soit NOT_FOUND
                assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        }

        @Test
        @DisplayName("Test findById et retourne bad request")
        public void testUserFindByIdBadRequest() {
                // ACT : on passe un id qui n'est pas un nombre
                ResponseEntity<?> response = userController.findById("toto");

                // ASSERT on s'attend à ce que le code retour soit BAD REQUEST
                assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        }

        @Test
        @DisplayName("Test delete un user")
        public void testDeleteUser() {
                // ARRANGE : un user à supprimer, un UserDetailsImpl, un authentication et mock
                // de userService
                Long id = 1L;
                String email = "toto@gmail.com";
                String firstname = "toto";
                String lastname = "titi";
                boolean isAdmin = false;
                String password = "toto123!";
                User user = new User(id, email, lastname, firstname, password, isAdmin, null, null);
                UserDetailsImpl userDetailsImpl = new UserDetailsImpl(id, email, firstname, lastname, null, password);
                Authentication authentication = new UsernamePasswordAuthenticationToken(userDetailsImpl, null);
                SecurityContextHolder.setContext(securityContext);

                when(securityContext.getAuthentication()).thenReturn(authentication);
                when(userService.findById(id)).thenReturn(user);
                doNothing().when(userService).delete(id);

                // ACT
                ResponseEntity<?> response = userController.save(id.toString());

                // ASSERT on s'attend à ce que le code retour soit OK
                assertEquals(HttpStatus.OK, response.getStatusCode());
        }

        @Test
        @DisplayName("Test delete un user inexistant et retourne Not Found")
        public void testDeleteNotFound() {
                // ARRANGE : mock de userService qui retourne null
                Long id = 1L;
                when(userService.findById(id)).thenReturn(null);

                // ACT
                ResponseEntity<?> response = userController.save(id.toString());

                // ASSERT on s'attend à ce que le code retour soit NOT_FOUND
                assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        }

        @Test
        @DisplayName("Test delete un user inexistant et retourne UNAUTHORIZED")
        public void testDeleteUnauthorized() {
                // ARRANGE : un user à supprimer, un UserDetailsImpl, un authentication et mock
                // de userService
                Long id = 1L;
                String email = "toto@gmail.com";
                String firstname = "toto";
                String lastname = "titi";
                boolean isAdmin = false;
                String password = "toto123!";
                User user = new User(id, email, lastname, firstname, password, isAdmin, null, null);
                // En authentification un email différent
                UserDetailsImpl userDetailsImpl = new UserDetailsImpl(id, "differentEmail@gmail.com", firstname,
                                lastname, null, password);
                Authentication authentication = new UsernamePasswordAuthenticationToken(userDetailsImpl, null);
                SecurityContextHolder.setContext(securityContext);

                when(securityContext.getAuthentication()).thenReturn(authentication);
                when(userService.findById(id)).thenReturn(user);

                // ACT
                ResponseEntity<?> response = userController.save(id.toString());

                // ASSERT on s'attend à ce que le code retour soit UNAUTHORIZED
                assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        }

        @Test
        @DisplayName("Test delete un user et retourne Bad Request")
        public void testDeleteBadRequest() {
                // ACT : on passe un id qui n'est pas un nombre
                ResponseEntity<?> response = userController.save("toto");

                // ASSERT on s'attend à ce que le code retour soit BAD REQUEST
                assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        }

}
