package com.example.codeStore.codeStore_app.service;

import java.util.List;

import com.example.codeStore.codeStore_app.model.PedidoModel;

public interface PedidoService {
    List<PedidoModel> obterTodos();
    PedidoModel obterPorId(Long id);
    PedidoModel cadastrarPedido(PedidoModel novo);
    PedidoModel atualizarPedido(Long id, PedidoModel atualizacao);
}
