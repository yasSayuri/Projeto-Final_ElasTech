package com.example.codeStore.codeStore_app.dto.mapper;

import org.springframework.stereotype.Component;

import com.example.codeStore.codeStore_app.dto.request.ProdutoRequest;
import com.example.codeStore.codeStore_app.dto.response.ProdutoResponse;
import com.example.codeStore.codeStore_app.model.Produto;

@Component
public class ProdutoMapper {
	
	public Produto toEntity(ProdutoRequest pRequest) {
		Produto produto = new Produto();
		//produto.setId(pRequest.getId());
		produto.setNome(pRequest.getNome());
		produto.setDescricao(pRequest.getDescricao());
		produto.setPreco(pRequest.getPreco());
		produto.setImagemURL(pRequest.getImagemURL());
		return produto;
	}
	
	public ProdutoResponse toResponse(Produto produto) {
		ProdutoResponse p2 = new ProdutoResponse();
		p2.setNome(produto.getNome());
		p2.setDescricao(produto.getDescricao());
		p2.setPreco(produto.getPreco());
		p2.setImagemURL(produto.getImagemURL());
		
		return p2;
	}
	
	

}