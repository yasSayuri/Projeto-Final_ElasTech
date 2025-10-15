package com.example.codeStore.codeStore_app.dto.response;

import java.math.BigDecimal;


public class PedidoResponse {

	private Integer usuarioId;
	
	private String status;
	
	private BigDecimal subtotal;
	
	private BigDecimal descontoTotal;
	
	private BigDecimal frete;
	
	private BigDecimal total;


	public Integer getUsuarioId() {
		return usuarioId;
	}

	public void setUsuarioId(Integer usuarioId) {
		this.usuarioId = usuarioId;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
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

	public BigDecimal getTotal() {
		return total;
	}

	public void setTotal(BigDecimal total) {
		this.total = total;
	}
	

}
