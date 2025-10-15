package com.example.codeStore.codeStore_app.dto.mapper;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

import com.example.codeStore.codeStore_app.dto.request.UsuarioRequest;
import com.example.codeStore.codeStore_app.dto.response.UsuarioResponse;
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
		return usuario;
			}
	
	public UsuarioResponse toResponse(Usuario usuario) {
		UsuarioResponse response = new UsuarioResponse();
		response.setNome(usuario.getNome());
		response.setEmail(usuario.getEmail());
		response.setCpf(usuario.getCpf());
		response.setTelefone(usuario.getTelefone());
		
		return response;
	}
	
	public List<UsuarioResponse> toResponseList(List<Usuario> usuarios) {
		List<UsuarioResponse> response = new ArrayList<>();
		
		for(Usuario usuario: usuarios) {
			response.add(toResponse(usuario));
		}
		
		return response;
	}
}
