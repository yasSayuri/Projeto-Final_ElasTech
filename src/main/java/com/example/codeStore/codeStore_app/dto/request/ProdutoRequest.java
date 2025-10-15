package com.example.codeStore.codeStore_app.dto.request;

import java.math.BigDecimal;

import com.example.codeStore.codeStore_app.enums.CategoriaProduto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.DecimalMin;

public class ProdutoRequest {
	
	@NotBlank(message = "O nome não pode ser nulo.")
	private String nome;

	@Size(min = 5)
	@NotBlank(message = "A descrição não pode ser nula.")
	private String descricao;
	
	@NotNull
	@Positive(message = "O preço não pode ser negativo.")
	@DecimalMin(value = "0.1", inclusive = true)
	private BigDecimal preco;
	
	@NotNull(message = "A categoria é obrigatória.")
	private CategoriaProduto categoriaProduto;
	

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

	public CategoriaProduto getCategoriaProduto() {
		return categoriaProduto;
	}

	public void setCategoriaProduto(CategoriaProduto categoriaProduto) {
		this.categoriaProduto = categoriaProduto;
	}
	

}