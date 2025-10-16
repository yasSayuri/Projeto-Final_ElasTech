package com.example.codeStore.codeStore_app.dto.response;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import com.example.codeStore.codeStore_app.model.Pedido;

import jakarta.persistence.ManyToMany;

public class ProdutoResponse {
	
	private Long id;
	private String nome;
	private String descricao;
	private BigDecimal preco;
	private String categoriaProduto;
	
	@ManyToMany(mappedBy = "produtos")
	private Set<Pedido> pedidos = new HashSet<Pedido>();
	
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

	public String getCategoriaProduto() {
		return categoriaProduto;
	}

	public void setCategoriaProduto(String categoriaProduto) {
		this.categoriaProduto = categoriaProduto;
	}
	
	public Set<Pedido> getPedidos() {
		return pedidos;
	}

	public void setPedidos(Set<Pedido> pedidos) {
		this.pedidos = pedidos;
	}
}