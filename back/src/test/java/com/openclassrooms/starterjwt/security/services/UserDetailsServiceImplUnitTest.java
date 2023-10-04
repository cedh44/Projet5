package com.openclassrooms.starterjwt.security.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;

@SpringBootTest
public class UserDetailsServiceImplUnitTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Test
    @DisplayName("Retourne un user par son username")
    public void testLoadUserByUsername() {
        // ARRANGE : un user et mock de userRepository
        User user = new User((long) 1, "toto@gmail.com", "toto", "titi", "password", false,
                LocalDateTime.parse("2023-08-29T00:00:00"), LocalDateTime.parse("2023-08-29T00:00:00"));

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        // ACT
        UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(user.getEmail());

        // ASSERT : on vérifie username et email
        assertEquals(user.getEmail(), userDetails.getUsername());
        assertEquals(user.getPassword(), userDetails.getPassword());
    }

    @Test
    public void testLoadByUsernameNotFound() {
        // ARRANGE : un userName inconnu  et mock de userRepository qui ne retourne rien
        String userName = "unknownUserName";
        when(userRepository.findByEmail(userName)).thenReturn(Optional.empty());
        
        // ASSERT : exception de type UsernameNotFoundException levée
        assertThrows(UsernameNotFoundException.class, () -> userDetailsServiceImpl.loadUserByUsername(userName));
    }
}
