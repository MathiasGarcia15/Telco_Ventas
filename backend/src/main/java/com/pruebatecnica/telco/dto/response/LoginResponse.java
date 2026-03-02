package com.pruebatecnica.telco.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String token;
    private String tokenType;
    private String username;
    private String rol;
    private Long userId;
}
