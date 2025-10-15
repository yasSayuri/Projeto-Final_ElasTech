package com.example.codeStore.codeStore_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.codeStore.codeStore_app.model.Pedido;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

}
