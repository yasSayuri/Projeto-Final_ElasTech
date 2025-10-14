package com.example.codeStore.codeStore_app.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.codeStore.codeStore_app.model.PedidoModel;
import com.example.codeStore.codeStore_app.service.PedidoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    // GET /api/pedidos -> obterTodos
    @GetMapping
    public ResponseEntity<List<PedidoModel>> obterTodos() {
        return ResponseEntity.ok(service.obterTodos());
    }

    // GET /api/pedidos/{id} -> obterPorId
    @GetMapping("/{id}")
    public ResponseEntity<PedidoModel> obterPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.obterPorId(id));
    }

    // POST /api/pedidos -> cadastrarPedido
    @PostMapping
    public ResponseEntity<PedidoModel> cadastrarPedido(@Valid @RequestBody PedidoModel novo) {
        PedidoModel criado = service.cadastrarPedido(novo);
        return ResponseEntity
                .created(URI.create("/api/pedidos/" + criado.getId()))
                .body(criado);
    }

    // PUT /api/pedidos/{id} -> atualizarPedido
    @PutMapping("/{id}")
    public ResponseEntity<PedidoModel> atualizarPedido(@PathVariable Long id,
                                                       @Valid @RequestBody PedidoModel atualizacao) {
        return ResponseEntity.ok(service.atualizarPedido(id, atualizacao));
    }
}
