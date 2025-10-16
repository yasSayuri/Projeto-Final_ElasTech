package com.example.codeStore.codeStore_app.dto.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.codeStore.codeStore_app.dto.request.ProdutoRequest;
import com.example.codeStore.codeStore_app.dto.response.ProdutoResponse;
import com.example.codeStore.codeStore_app.model.Produto;

@Component
public class ProdutoMapper {
	
	public Produto toEntity(ProdutoRequest pRequest) {
		Produto produto = new Produto();
		produto.setNome(pRequest.getNome());
		produto.setDescricao(pRequest.getDescricao());
		produto.setPreco(pRequest.getPreco());
		produto.setCategoriaProduto(pRequest.getCategoriaProduto());

		return produto;
	}
	
	public ProdutoResponse toResponse(Produto produto) {
		ProdutoResponse produto2 = new ProdutoResponse();
		produto2.setId(produto.getId());
		produto2.setNome(produto.getNome());
		produto2.setDescricao(produto.getDescricao());
		produto2.setPreco(produto.getPreco());
		produto2.setCategoriaProduto(produto.getCategoriaProduto().name());
		
		return produto2;
	}
	
	public List<ProdutoResponse> toListDTO(List<Produto> produtos){
		return produtos
				.stream()
				.map(this::toResponse)
				.collect(Collectors.toList());
	}
	

}