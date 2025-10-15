package com.example.codeStore.codeStore_app.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.codeStore.codeStore_app.dto.mapper.ProdutoMapper;
import com.example.codeStore.codeStore_app.dto.request.ProdutoRequest;
import com.example.codeStore.codeStore_app.dto.response.ProdutoResponse;
import com.example.codeStore.codeStore_app.model.Produto;
import com.example.codeStore.codeStore_app.service.ProdutoService;

import jakarta.validation.Valid;

@RestController
public class ProdutoController {
	
	private ProdutoService produtoService;
	private ProdutoMapper produtoMapper;
	
	public ProdutoController(ProdutoService produtoService, ProdutoMapper produtoMapper) {
		this.produtoService = produtoService;
		this.produtoMapper = produtoMapper;
	}
	
	@GetMapping("/produtos")
	public List<ProdutoResponse> pesquisarTodos(){
		return produtoMapper.toListDTO(produtoService.buscarTodos());
	}
	
	@GetMapping("produto/{id}")
	public ResponseEntity<ProdutoResponse> buscarPorId(@PathVariable Long id) {
		Produto produto = produtoService.buscarPorId(id);
		return ResponseEntity.ok(produtoMapper.toResponse(produto));
	}
	
	@GetMapping("produtoNome/{nome}")
	public List<ProdutoResponse> pesquisarPorNome(@PathVariable String nome) {
		return produtoMapper.toListDTO(produtoService.buscarPorNome(nome));
	}
	
	@GetMapping("produto/precoAsc")
	public List<ProdutoResponse> precoAscendente(){
		List<Produto> pList = produtoService.ordenarPorOrdemAscendente();
		return produtoMapper.toListDTO(pList);
	}
	
	@GetMapping("produto/precoDesc")
	public List<ProdutoResponse> precoDescendente(){
		List<Produto> pList = produtoService.ordenarPorOrdemDescente();
		return produtoMapper.toListDTO(pList);
	}
	
	@PostMapping("produto/salvar")
	@ResponseStatus(HttpStatus.CREATED)
	public ProdutoResponse salvar(@Valid @RequestBody ProdutoRequest pRequest) {
		Produto produto = produtoMapper.toEntity(pRequest);
		Produto produtoSalvo = produtoService.salvar(produto);
		
		return produtoMapper.toResponse(produtoSalvo);
	}
	
	@PutMapping("produto/atualizar/{id}")
	public ResponseEntity<ProdutoResponse> atualizarProduto(@PathVariable Long id, 
			@Valid @RequestBody ProdutoRequest pRequest) {
		
		if(!produtoService.existisById(id)) {
			 return ResponseEntity.notFound().build();
		}
		
		Produto produto = produtoMapper.toEntity(pRequest);
		produto.setId(id);
		Produto produtoAtualizado = produtoService.salvar(produto);
		return ResponseEntity.ok(produtoMapper.toResponse(produtoAtualizado));
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> excluir(@PathVariable Long id) {
		if(!produtoService.existisById(id)) {
			 return ResponseEntity.notFound().build();
		}
		produtoService.excluir(id);
		return ResponseEntity.noContent().build();
	}
	

}