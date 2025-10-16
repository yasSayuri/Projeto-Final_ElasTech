package com.example.codeStore.codeStore_app.dto.mapper;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import com.example.codeStore.codeStore_app.dto.request.UsuarioRequest;
import com.example.codeStore.codeStore_app.dto.response.UsuarioResponse;
import com.example.codeStore.codeStore_app.dto.request.UsuarioUpdateRequest;
import com.example.codeStore.codeStore_app.model.Usuario;

@Component
public class UsuarioMapper {
    public Usuario toEntity(UsuarioRequest pRequest) {
        Usuario usuario = new Usuario();
        usuario.setNome(pRequest.getNome());
        usuario.setEmail(pRequest.getEmail());
        usuario.setCpf(pRequest.getCpf());
        usuario.setTelefone(pRequest.getTelefone());
        usuario.setSenha(pRequest.getSenha());
        usuario.setRole(pRequest.getRole());
        return usuario;
    }

    public UsuarioResponse toResponse(Usuario usuario) {
        UsuarioResponse response = new UsuarioResponse();
        response.setId(usuario.getId());
        response.setNome(usuario.getNome());
        response.setEmail(usuario.getEmail());
        response.setCpf(usuario.getCpf());
        response.setTelefone(usuario.getTelefone());
        response.setRole(usuario.getRole());
        return response;
    }
    
    public void applyPartialUpdate(UsuarioUpdateRequest dto, Usuario entity) {
        if (dto.getNome() != null)      entity.setNome(dto.getNome());
        if (dto.getEmail() != null)     entity.setEmail(dto.getEmail());
        if (dto.getCpf() != null)       entity.setCpf(dto.getCpf());
        if (dto.getTelefone() != null)  entity.setTelefone(dto.getTelefone());
        if (StringUtils.hasText(dto.getSenha())) entity.setSenha(dto.getSenha());
    }

    public List<UsuarioResponse> toResponseList(List<Usuario> usuarios) {
        List<UsuarioResponse> response = new ArrayList<>();
        for (Usuario usuario : usuarios) {
            response.add(toResponse(usuario));
        }
        return response;
    }
}
