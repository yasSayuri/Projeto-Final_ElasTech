package com.example.codeStore.codeStore_app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.codeStore.codeStore_app.model.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
	
	List<Produto> findByNomeContainingIgnoreCase(String nome);
	List<Produto> findAllByPrecoOrderByPrecoAsc();
	List<Produto> findAllByPrecoOrderByPrecoDesc();
}