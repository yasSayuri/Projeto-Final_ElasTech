package com.example.codeStore.codeStore_app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.codeStore.codeStore_app.model.Pedido;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Busca todos os pedidos de um usuário, mais recentes primeiro.
    // (Assumindo que Pedido possui um campo `Usuario usuario;`)
    List<Pedido> findByUsuario_IdOrderByIdDesc(Long usuarioId);
}
