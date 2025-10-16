package com.example.codeStore.codeStore_app.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.codeStore.codeStore_app.dto.mapper.UsuarioMapper;
import com.example.codeStore.codeStore_app.dto.request.LoginRequest;
import com.example.codeStore.codeStore_app.dto.request.UsuarioRequest;
import com.example.codeStore.codeStore_app.dto.request.UsuarioUpdateRequest;
import com.example.codeStore.codeStore_app.dto.response.UsuarioResponse;
import com.example.codeStore.codeStore_app.exception.NegocioException;
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


    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listar() {
        List<Usuario> lista = service.obterTodos();
        return ResponseEntity.ok(lista.stream().map(usuarioMapper::toResponse).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> obterPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioMapper.toResponse(service.obterPorId(id)));
    }

    @GetMapping("/buscarEmail/{email}")
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


    @PostMapping("/login")
    public ResponseEntity<UsuarioResponse> login(@Valid @RequestBody LoginRequest req) {
        Usuario u = service.autenticar(req.getEmail(), req.getSenha());
        return ResponseEntity.ok(usuarioMapper.toResponse(u));
    }


    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> atualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioRequest dto) {

        if (!service.existisById(id)) {
            return ResponseEntity.notFound().build();
        }

        Usuario atual = service.obterPorId(id);

        if (dto.getEmail() != null &&
            !dto.getEmail().equalsIgnoreCase(atual.getEmail()) &&
            service.emailExiste(dto.getEmail())) {
            throw new NegocioException("Já existe um usuário cadastrado com este e-mail!");
        }

        Usuario novo = usuarioMapper.toEntity(dto);
        novo.setId(id);
        Usuario atualizado = service.atualizarUsuario(novo);
        return ResponseEntity.ok(usuarioMapper.toResponse(atualizado));
    }


    @PatchMapping("/{id}")
    public ResponseEntity<UsuarioResponse> atualizarParcial(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioUpdateRequest dto) {

        if (!service.existisById(id)) {
            return ResponseEntity.notFound().build();
        }

        Usuario atual = service.obterPorId(id);

        if (dto.getEmail() != null &&
            !dto.getEmail().equalsIgnoreCase(atual.getEmail()) &&
            service.emailExiste(dto.getEmail())) {
            throw new NegocioException("Já existe um usuário cadastrado com este e-mail!");
        }

        usuarioMapper.applyPartialUpdate(dto, atual);
        Usuario salvo = service.atualizarUsuario(atual);
        return ResponseEntity.ok(usuarioMapper.toResponse(salvo));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (!service.existisById(id)) {
            return ResponseEntity.notFound().build();
        }
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
