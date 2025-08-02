package com.copilotprompter.service;

import com.copilotprompter.dto.AuthResponse;
import com.copilotprompter.dto.LoginRequest;
import com.copilotprompter.dto.RegisterRequest;
import com.copilotprompter.dto.UserDTO;
import com.copilotprompter.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user: {}", request.getUsername());
        
        // Check if user already exists
        if (userService.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userService.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(User.Role.USER);
        user.setEnabled(true);
        
        User savedUser = userService.createUser(user);
        
        // Generate tokens
        UserDetails userDetails = userService.loadUserByUsername(savedUser.getUsername());
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);
        
        UserDTO userDTO = userService.convertToDTO(savedUser);
        
        return new AuthResponse(
                accessToken,
                refreshToken,
                jwtService.getJwtExpiration(),
                userDTO
        );
    }

    public AuthResponse authenticate(LoginRequest request) {
        log.info("Authenticating user: {}", request.getUsername());
        
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = userService.loadUserByUsername(request.getUsername());
        UserDTO userDTO = userService.getUserByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        // Update last login
        userService.updateLastLogin(request.getUsername());

        return new AuthResponse(
                accessToken,
                refreshToken,
                jwtService.getJwtExpiration(),
                userDTO
        );
    }

    public AuthResponse refreshToken(String refreshToken) {
        log.info("Refreshing token");
        
        String username = jwtService.extractUsername(refreshToken);
        UserDetails userDetails = userService.loadUserByUsername(username);
        
        if (jwtService.isTokenValid(refreshToken, userDetails)) {
            String newAccessToken = jwtService.generateToken(userDetails);
            UserDTO userDTO = userService.getUserByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            return new AuthResponse(
                    newAccessToken,
                    refreshToken,
                    jwtService.getJwtExpiration(),
                    userDTO
            );
        }
        
        throw new RuntimeException("Invalid refresh token");
    }
}
