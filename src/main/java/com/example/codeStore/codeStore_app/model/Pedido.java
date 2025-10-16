package com.example.codeStore.codeStore_app.model;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import com.example.codeStore.codeStore_app.enums.PedidoStatusEnum;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotNull;


@Entity
@Table(name="pedidos")
public class Pedido {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false, name = "status")
	private PedidoStatusEnum status;
	
    @Column(precision = 15, scale = 2)
	private BigDecimal subtotal;
	
    @Column(precision = 15, scale = 2)
	private BigDecimal descontoTotal;
	
    @Column(precision = 15, scale = 2)
	private BigDecimal frete;
	
    @Column(precision = 15, scale = 2)
	private BigDecimal total;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(
        name = "pedido_produto", 
        joinColumns = @JoinColumn(name = "pedido_id"),
        inverseJoinColumns = @JoinColumn(name = "produto_id")
    )
    @JsonManagedReference
    private Set<Produto> produtos = new HashSet<>();

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<PedidoProduto> pedidoProdutos = new HashSet<>();
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
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
	
	public Set<Produto> getProdutos() {
	    return produtos;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}
	
	public void setProdutos(Set<Produto> produtos) {
	    this.produtos = produtos;
	}

	public Set<PedidoProduto> getPedidoProdutos() {
	    return pedidoProdutos;
	}

	public void setPedidoProdutos(Set<PedidoProduto> pedidoProdutos) {
	    this.pedidoProdutos = pedidoProdutos;
	}
	
	
}
