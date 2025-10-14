package com.example.codeStore.codeStore_app.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.codeStore.codeStore_app.exception.EntidadeNaoEncontradaException;
import com.example.codeStore.codeStore_app.model.Produto;
import com.example.codeStore.codeStore_app.repository.ProdutoRepository;

import jakarta.transaction.Transactional;

@Service
public class ProdutoService {

	private ProdutoRepository produtoRepository;

	public ProdutoService(ProdutoRepository produtoRepository) {
		this.produtoRepository = produtoRepository;
	}
	
	@Transactional
	public Produto salvar(Produto produto) {
		return produtoRepository.save(produto);
	}
	
	public Produto buscarPorId(Long id) {
		return produtoRepository.findById(id)
				.orElseThrow(() -> new EntidadeNaoEncontradaException("Produto não encontrado!"));
	}
	
	public List<Produto> buscarTodos(){
		return produtoRepository.findAll();
	}
	
	public List<Produto> buscarPorNome(String nome){
		return produtoRepository.findByNomeContainingIgnoreCase(nome);
	}
	
	public List<Produto> ordenarPorOrdemAscendente(){
		return produtoRepository.findAllByOrderByPrecoAsc();
	}
	
	public List<Produto> ordenarPorOrdemDescente(){
		return produtoRepository.findAllByOrderByPrecoDesc();
	}
	
	public Produto atualizar(Long id, Produto produto) {
		Produto pr = produtoRepository.findById(id)
				.orElseThrow(() -> new EntidadeNaoEncontradaException("Não é possível atualizar um produto que não existe!"));
		
		return produtoRepository.save(produto);
	}
	
	@Transactional
	public void excluir(Long id) {
		produtoRepository.deleteById(id);
	}
	
	public Boolean existisById(Long id) {
		return produtoRepository.existsById(id);
	}

	

}