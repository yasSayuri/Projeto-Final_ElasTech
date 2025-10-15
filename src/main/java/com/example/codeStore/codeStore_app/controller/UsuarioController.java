package com.example.codeStore.codeStore_app.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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

    // GET /api/usuarios -> obterTodos
    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> obterTodos() {
    	List<Usuario> usuarios = service.obterTodos();
        return ResponseEntity.ok(usuarioMapper.toResponseList(usuarios));
    }

    // GET /api/usuarios/{id} -> obterPorId
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> obterPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioMapper.toResponse(service.obterPorId(id)));
    }

    // POST /api/usuarios -> cadastrarUsuario
    @PostMapping
    public ResponseEntity<UsuarioResponse> cadastrarUsuario(@Valid @RequestBody UsuarioRequest dto) {
        Usuario criado = service.cadastrarUsuario(dto);
        return ResponseEntity
                .created(URI.create("/api/usuarios/" + criado.getId()))
                .body(usuarioMapper.toResponse(criado));
    }

    // PUT /api/usuarios/{id} -> atualizarUsuario
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> atualizarUsuario(
    		@PathVariable Long id,
            @Valid @RequestBody UsuarioRequest dto
    ) {
    	Usuario atualizado = service.atualizarUsuario(id, dto);
        return ResponseEntity.ok(usuarioMapper.toResponse(atualizado));
    }
}
