package com.pruebatecnica.telco.service;

import com.pruebatecnica.telco.dto.request.LoginRequest;
import com.pruebatecnica.telco.dto.response.LoginResponse;
import com.pruebatecnica.telco.entity.Usuario;
import com.pruebatecnica.telco.repository.UsuarioRepository;
import com.pruebatecnica.telco.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        Usuario usuario = usuarioRepository.findByUsername(request.getUsername()).orElseThrow();
        String token = jwtUtil.generateToken(userDetails, usuario.getRol().name());

        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .username(usuario.getUsername())
                .rol(usuario.getRol().name())
                .userId(usuario.getId())
                .build();
    }
}
