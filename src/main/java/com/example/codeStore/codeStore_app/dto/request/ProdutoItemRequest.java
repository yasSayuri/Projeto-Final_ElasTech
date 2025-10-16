package com.example.codeStore.codeStore_app.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ProdutoItemRequest {
	
	@NotNull(message = "O id não pode ser nulo.")
	@Positive(message = "O preço não pode ser negativo.")
	private Long id;

	@NotNull
	@Positive(message = "A quantidade não pode ser negativa.")
	private Integer quantidade;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getQuantidade() {
		return quantidade;
	}

	public void setQuantidade(Integer quantidade) {
		this.quantidade = quantidade;
	}	
}