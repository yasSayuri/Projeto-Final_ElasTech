package com.example.codeStore.codeStore_app.dto.request;

import java.math.BigDecimal;

import com.example.codeStore.codeStore_app.enums.PedidoStatusEnum;

public class PedidoRequest {
	private Long id;
	
	private Long usuarioId;
	
	private PedidoStatusEnum status;
	
	private BigDecimal subtotal;
	
	private BigDecimal descontoTotal;
	
	private BigDecimal frete;
	


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

	public BigDecimal getSubtotal() {
		return subtotal;
	}

	public void setSubtotal(BigDecimal subtotal) {
		this.subtotal = subtotal;
	}

	public BigDecimal getDescontoTotal() {
		return descontoTotal;
	}

	public void setDescontoTotal(BigDecimal descontoTotal) {
		this.descontoTotal = descontoTotal;
	}

	public BigDecimal getFrete() {
		return frete;
	}

	public void setFrete(BigDecimal frete) {
		this.frete = frete;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
}
