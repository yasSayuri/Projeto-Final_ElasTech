package com.example.codeStore.codeStore_app.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UsuarioUpdateRequest {
    private String nome;

    @Email
    private String email;

    private String cpf;

    @Pattern(regexp = "\\d+", message = "O telefone deve conter apenas números.")
    private String telefone;

    @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres!")
    private String senha;


	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getTelefone() {
		return telefone;
	}

	public void setTelefone(String telefone) {
		this.telefone = telefone;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}
}
