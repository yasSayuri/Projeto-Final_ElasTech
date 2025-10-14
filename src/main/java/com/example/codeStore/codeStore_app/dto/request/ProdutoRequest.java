package com.example.codeStore.codeStore_app.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class ProdutoRequest {
	
	private Long id;
	
	@NotNull(message = "O nome não pode ser nulo.")
	private String nome;

	@Size(min = 10)
	@NotNull(message = "A descrição não pode ser nula.")
	private String descricao;
	
	@NotNull
	@Positive(message = "O preço não pode ser negativo.")
	private BigDecimal preco;
	
	//@NotNull
	private String imagemURL;
	

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public BigDecimal getPreco() {
		return preco;
	}

	public void setPreco(BigDecimal preco) {
		this.preco = preco;
	}

	public String getImagemURL() {
		return imagemURL;
	}

	public void setImagemURL(String imagemURL) {
		this.imagemURL = imagemURL;
	}
	
	

}