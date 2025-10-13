package com.example.codeStore.codeStore_app.controller;

import com.example.codeStore.codeStore_app.model.Usuario;
import com.example.codeStore.codeStore_app.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.Optional;

@Controller
public class AuthController {
    private final UsuarioRepository repo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthController(UsuarioRepository repo) {
        this.repo = repo;
    }

    @PostMapping(value="/api/usuarios", consumes="application/x-www-form-urlencoded")
    public RedirectView cadastrar(@Valid Usuario u) {
        if (repo.existsByEmail(u.getEmail())) return new RedirectView("/register.html?erro=email");
        u.setSenha(encoder.encode(u.getSenha()));
        repo.save(u);
        return new RedirectView("/login.html?ok=1");
    }

    @PostMapping(value="/api/login", consumes="application/x-www-form-urlencoded")
    public RedirectView login(@RequestParam String email, @RequestParam String senha) {
        Optional<Usuario> u = repo.findByEmail(email);
        if (u.isPresent() && encoder.matches(senha, u.get().getSenha())) return new RedirectView("/loja.html");
        return new RedirectView("/login.html?erro=1");
    }
}
