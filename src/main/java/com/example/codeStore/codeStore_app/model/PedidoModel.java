package com.example.codeStore.codeStore_app.model;

import java.math.BigDecimal;

import com.example.codeStore.codeStore_app.enums.PedidoStatusEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name="pedidos")
public class PedidoModel {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	
	@NotBlank
	private int usuarioId;
	
	private PedidoStatusEnum status;
	
	@NotBlank @DecimalMin(value = "0.00")
    @Column(precision = 15, scale = 2)
	private BigDecimal subtotal;
	
	@NotNull @DecimalMin(value = "0.00")
    @Column(precision = 15, scale = 2)
	private BigDecimal descontoTotal;
	
	@NotNull @DecimalMin(value = "0.00")
    @Column(precision = 15, scale = 2)
	private BigDecimal frete;
	
	@NotBlank @DecimalMin(value = "0.00")
    @Column(precision = 15, scale = 2)
	private BigDecimal total;
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public int getUsuarioId() {
		return usuarioId;
	}

	public void setUsuarioId(int usuarioId) {
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

	public BigDecimal getTotal() {
		return total;
	}

	public void setTotal(BigDecimal total) {
		this.total = total;
	}

}
