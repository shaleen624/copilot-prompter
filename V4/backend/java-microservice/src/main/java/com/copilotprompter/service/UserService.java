package com.copilotprompter.service;

import com.copilotprompter.dto.UserDTO;
import com.copilotprompter.model.User;
import com.copilotprompter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final MappingService mappingService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    public List<UserDTO> getAllUsers() {
        log.info("Fetching all users");
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(mappingService::toUserDTO)
                .toList();
    }

    public Optional<UserDTO> getUserById(Long id) {
        log.info("Fetching user by id: {}", id);
        return userRepository.findById(id)
                .map(mappingService::toUserDTO);
    }

    public Optional<UserDTO> getUserByUsername(String username) {
        log.info("Fetching user by username: {}", username);
        return userRepository.findByUsername(username)
                .map(mappingService::toUserDTO);
    }

    public UserDTO createUser(UserDTO userDTO, String password) {
        log.info("Creating new user: {}", userDTO.getUsername());
        
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userDTO.getEmail() != null && userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = mappingService.toUserEntity(userDTO);
        user.setPassword(passwordEncoder.encode(password));
        user.setEnabled(true);
        user.setAccountNonExpired(true);
        user.setAccountNonLocked(true);
        user.setCredentialsNonExpired(true);
        
        if (user.getRole() == null) {
            user.setRole(User.Role.USER);
        }

        User savedUser = userRepository.save(user);
        return mappingService.toUserDTO(savedUser);
    }

    public Optional<UserDTO> updateUser(Long id, UserDTO userDTO) {
        log.info("Updating user with id: {}", id);
        return userRepository.findById(id)
                .map(existingUser -> {
                    if (userDTO.getEmail() != null && !userDTO.getEmail().equals(existingUser.getEmail()) 
                        && userRepository.existsByEmail(userDTO.getEmail())) {
                        throw new RuntimeException("Email already exists");
                    }
                    
                    existingUser.setEmail(userDTO.getEmail());
                    existingUser.setFirstName(userDTO.getFirstName());
                    existingUser.setLastName(userDTO.getLastName());
                    existingUser.setEnabled(userDTO.getEnabled());
                    
                    if (userDTO.getRole() != null) {
                        existingUser.setRole(User.Role.valueOf(userDTO.getRole()));
                    }
                    
                    User updatedUser = userRepository.save(existingUser);
                    return mappingService.toUserDTO(updatedUser);
                });
    }

    public boolean deleteUser(Long id) {
        log.info("Deleting user with id: {}", id);
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return true;
                })
                .orElse(false);
    }

    public boolean changePassword(Long id, String currentPassword, String newPassword) {
        log.info("Changing password for user id: {}", id);
        return userRepository.findById(id)
                .map(user -> {
                    if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                        throw new RuntimeException("Current password is incorrect");
                    }
                    user.setPassword(passwordEncoder.encode(newPassword));
                    userRepository.save(user);
                    return true;
                })
                .orElse(false);
    }

    public void updateLastLogin(String username) {
        log.info("Updating last login for user: {}", username);
        userRepository.findByUsername(username)
                .ifPresent(user -> {
                    user.setLastLoginAt(LocalDateTime.now());
                    userRepository.save(user);
                });
    }

    public boolean enableUser(Long id, boolean enabled) {
        log.info("Setting user enabled status to {} for id: {}", enabled, id);
        return userRepository.findById(id)
                .map(user -> {
                    user.setEnabled(enabled);
                    userRepository.save(user);
                    return true;
                })
                .orElse(false);
    }

    // Convenience methods for AuthService
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public User createUser(User user) {
        return userRepository.save(user);
    }
    
    public UserDTO convertToDTO(User user) {
        return mappingService.toUserDTO(user);
    }
}
