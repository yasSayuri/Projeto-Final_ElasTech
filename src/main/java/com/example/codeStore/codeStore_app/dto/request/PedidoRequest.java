package com.example.codeStore.codeStore_app.dto.request;

import java.util.List;

import com.example.codeStore.codeStore_app.enums.PedidoStatusEnum;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class PedidoRequest {
	private Long id;
	
	@NotNull
	@Positive(message = "O id do usuário não pode ser negativo.")
	private Long usuarioId;
	
	@NotNull(message = "O status é obrigatória.")
	private PedidoStatusEnum status;
	
	private List<ProdutoItemRequest> produtos;
	
	public Long getUsuarioId() {
		return usuarioId;
	}

	public void setUsuarioId(Long usuarioId) {
		this.usuarioId = usuarioId;
	}

	public PedidoStatusEnum getStatus() {
		return status;
	}

	public void setStatus(PedidoStatusEnum status) {
		this.status = status;
	}

	public List<ProdutoItemRequest> getProdutos() {
		return produtos;
	}

	public void setProdutos(List<ProdutoItemRequest> produtos) {
		this.produtos = produtos;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
}
