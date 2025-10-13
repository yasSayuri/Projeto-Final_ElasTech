package com.example.codeStore.codeStore_app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name="usuarios", uniqueConstraints=@UniqueConstraint(columnNames="email"))
public class Usuario {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nome;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Column(length=14)
    private String cpf;

    @NotBlank
    @Column(length=20)
    private String telefone;

    @NotBlank
    private String senha;

    public Long getId(){return id;}
    public void setId(Long id){this.id=id;}
    public String getNome(){return nome;}
    public void setNome(String nome){this.nome=nome;}
    public String getEmail(){return email;}
    public void setEmail(String email){this.email=email;}
    public String getCpf(){return cpf;}
    public void setCpf(String cpf){this.cpf=cpf;}
    public String getTelefone(){return telefone;}
    public void setTelefone(String telefone){this.telefone=telefone;}
    public String getSenha(){return senha;}
    public void setSenha(String senha){this.senha=senha;}
}
