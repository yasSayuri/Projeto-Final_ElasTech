package com.example.codeStore.codeStore_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.codeStore.codeStore_app.model.PedidoProduto;

import jakarta.transaction.Transactional;

@Repository
public interface PedidoProdutoRepository extends JpaRepository<PedidoProduto, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM PedidoProduto pp WHERE pp.pedido.id = :pedidoId")
    void deleteAllByPedidoId(@Param("pedidoId") Long pedidoId);
}