package com.copilotprompter.controller;

import com.copilotprompter.dto.UserDTO;
import com.copilotprompter.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin management endpoints")
public class AdminController {

    private final UserService userService;

    @GetMapping("/users")
    @Operation(summary = "Get all users", description = "Retrieve all users (Admin only)")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieve a specific user by ID (Admin only)")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/users")
    @Operation(summary = "Create new user", description = "Create a new user (Admin only)")
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserDTO userDTO, 
                                             @RequestParam String password) {
        UserDTO createdUser = userService.createUser(userDTO, password);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @PutMapping("/users/{id}")
    @Operation(summary = "Update user", description = "Update an existing user (Admin only)")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UserDTO userDTO) {
        return userService.updateUser(id, userDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user", description = "Delete a user (Admin only)")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUser(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PutMapping("/users/{id}/enable")
    @Operation(summary = "Enable/Disable user", description = "Enable or disable a user account (Admin only)")
    public ResponseEntity<Void> enableUser(@PathVariable Long id, @RequestParam boolean enabled) {
        boolean updated = userService.enableUser(id, enabled);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PutMapping("/users/{id}/change-password")
    @Operation(summary = "Change user password", description = "Change a user's password (Admin only)")
    public ResponseEntity<Void> changeUserPassword(@PathVariable Long id, 
                                                   @RequestBody Map<String, String> passwordData) {
        String currentPassword = passwordData.get("currentPassword");
        String newPassword = passwordData.get("newPassword");
        
        boolean changed = userService.changePassword(id, currentPassword, newPassword);
        return changed ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }
}
