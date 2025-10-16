package com.example.codeStore.codeStore_app.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.codeStore.codeStore_app.exception.EntidadeNaoEncontradaException;
import com.example.codeStore.codeStore_app.exception.NegocioException;
import com.example.codeStore.codeStore_app.model.Usuario;
import com.example.codeStore.codeStore_app.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Usuario> obterTodos() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Usuario obterPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new EntidadeNaoEncontradaException("Usuário não encontrado!"));
    }

    @Transactional(readOnly = true)
    public Usuario obterPorEmail(String email) {
        return repository.findByEmail(email).orElseThrow(() -> new EntidadeNaoEncontradaException("Usuário não existe!"));
    }

    @Transactional
    public Usuario cadastrarUsuario(Usuario usuario) {
        Optional<Usuario> emailExistente = repository.findByEmail(usuario.getEmail());
        if (emailExistente.isPresent()) {
            throw new NegocioException("Já existe um usuário cadastrado com este email!");
        }
        if (usuario.getRole() == null || usuario.getRole().isBlank()) {
            usuario.setRole("CLIENTE");
        }
        return repository.save(usuario);
    }

    @Transactional
    public Usuario atualizarUsuario(Usuario usuario) {
        return repository.save(usuario);
    }

    public Boolean existisById(Long id) {
        return repository.existsById(id);
    }

    @Transactional
    public void excluir(Long id) {
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Usuario autenticar(String email, String senha) {
        return repository.findByEmailAndSenha(email, senha)
            .orElseThrow(() -> new EntidadeNaoEncontradaException("Credenciais inválidas"));
    }
    
    @Transactional(readOnly = true)
    public boolean emailExiste(String email) {
        return repository.findByEmail(email).isPresent();
    }

}
