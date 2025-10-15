package com.example.codeStore.codeStore_app.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.codeStore.codeStore_app.dto.mapper.UsuarioMapper;
import com.example.codeStore.codeStore_app.dto.request.UsuarioRequest;
import com.example.codeStore.codeStore_app.model.Usuario;
import com.example.codeStore.codeStore_app.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final UsuarioMapper usuarioMapper;

    public UsuarioService(UsuarioRepository repository, UsuarioMapper usuarioMapper) {
        this.repository = repository;
        this.usuarioMapper = usuarioMapper;
    }

    @Transactional(readOnly = true)
    public List<Usuario> obterTodos() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Usuario obterPorId(Long id) {
        return repository.findById(id).get();
    }

    @Transactional
    public Usuario cadastrarUsuario(UsuarioRequest dto) {
    	Usuario usuario = usuarioMapper.toEntity(dto); 
        return repository.save(usuario);
    }

    @Transactional
    public Usuario atualizarUsuario(Long id, UsuarioRequest dto) {
        Usuario existente = obterPorId(id);

        // Atualiza campos editáveis       
        existente.setNome(dto.getNome());
		existente.setTelefone(dto.getTelefone());
		//existente.setSenha(dto.getSenha()); //Validar se será possível alterar senha

        return repository.save(existente);
    }
}
