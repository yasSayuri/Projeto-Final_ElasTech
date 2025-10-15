package com.example.codeStore.codeStore_app.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.codeStore.codeStore_app.dto.mapper.UsuarioMapper;
import com.example.codeStore.codeStore_app.dto.request.UsuarioRequest;
import com.example.codeStore.codeStore_app.dto.response.UsuarioResponse;
import com.example.codeStore.codeStore_app.model.Usuario;
import com.example.codeStore.codeStore_app.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService service;
    private final UsuarioMapper usuarioMapper;

    public UsuarioController(UsuarioService service, UsuarioMapper usuarioMapper) {
        this.service = service;
        this.usuarioMapper = usuarioMapper;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> obterPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioMapper.toResponse(service.obterPorId(id)));
    }
    
    @GetMapping("buscarEmail/{email}")
    public ResponseEntity<UsuarioResponse> obterPorEmail(@PathVariable String email) {
        return ResponseEntity.ok(usuarioMapper.toResponse(service.obterPorEmail(email)));
    }
    
    @PostMapping("/cadastrar")
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse cadastrarUsuario(@Valid @RequestBody UsuarioRequest dto) {
    	Usuario usuario = usuarioMapper.toEntity(dto);
    	Usuario usuarioCadastrado = service.cadastrarUsuario(usuario);
    
    	return usuarioMapper.toResponse(usuarioCadastrado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> atualizarUsuario (@PathVariable Long id, 
    		@Valid @RequestBody UsuarioRequest dto) {
		
    	if(!service.existisById(id)) {
			 return ResponseEntity.notFound().build();
		}
    	Usuario usuario = usuarioMapper.toEntity(dto);
    	usuario.setId(id);
    	Usuario atualizado = service.atualizarUsuario(usuario);
        return ResponseEntity.ok(usuarioMapper.toResponse(atualizado));
    }
    
}