package com.example.codeStore.codeStore_app.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.codeStore.codeStore_app.dto.mapper.ProdutoMapper;
import com.example.codeStore.codeStore_app.dto.request.ProdutoRequest;
import com.example.codeStore.codeStore_app.dto.response.ProdutoResponse;
import com.example.codeStore.codeStore_app.model.Produto;
import com.example.codeStore.codeStore_app.service.ProdutoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("produto")
public class ProdutoController {
	
	private ProdutoService produtoService;
	private ProdutoMapper produtoMapper;
	
	public ProdutoController(ProdutoService produtoService, ProdutoMapper produtoMapper) {
		this.produtoService = produtoService;
		this.produtoMapper = produtoMapper;
	}
	
	@PostMapping("/salvar")
	@ResponseStatus(HttpStatus.CREATED)
	public ProdutoResponse salvar(@Valid @RequestBody ProdutoRequest pRequest) {
		Produto produto = produtoMapper.toEntity(pRequest);
		Produto produtoSalvo = produtoService.salvar(produto);
		
		return produtoMapper.toResponse(produtoSalvo);
	}
	
	
	

}