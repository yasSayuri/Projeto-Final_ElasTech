package com.example.codeStore.codeStore_app.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.codeStore.codeStore_app.dto.mapper.PedidoMapper;
import com.example.codeStore.codeStore_app.dto.request.PedidoRequest;
import com.example.codeStore.codeStore_app.dto.response.PedidoResponse;
import com.example.codeStore.codeStore_app.model.Pedido;
import com.example.codeStore.codeStore_app.service.PedidoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService service;
    private final PedidoMapper pedidoMapper;

    public PedidoController(PedidoService service, PedidoMapper pedidoMapper) {
        this.service = service;
        this.pedidoMapper = pedidoMapper;
    }

    // GET /api/pedidos -> listar todos (admin/debug)
    @GetMapping
    public ResponseEntity<List<PedidoResponse>> obterTodos() {
        List<Pedido> pedidos = service.obterTodos();
        return ResponseEntity.ok(pedidoMapper.toResponseList(pedidos));
    }

    // GET /api/pedidos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponse> obterPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoMapper.toResponse(service.obterPorId(id)));
    }

    // GET /api/pedidos/usuario/{usuarioId}  <<<<<<  USADO NO PERFIL
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<PedidoResponse>> listarPorUsuario(@PathVariable Long usuarioId) {
        List<Pedido> lista = service.obterPorUsuario(usuarioId);
        return ResponseEntity.ok(pedidoMapper.toResponseList(lista));
    }

    // POST /api/pedidos
    @PostMapping
    public ResponseEntity<PedidoResponse> cadastrarPedido(@Valid @RequestBody PedidoRequest dto) {
        Pedido criado = service.cadastrarPedido(dto);
        return ResponseEntity
            .created(URI.create("/api/pedidos/" + criado.getId()))
            .body(pedidoMapper.toResponse(criado));
    }

    // PUT /api/pedidos/{id}
    @PutMapping("/{id}")
    public ResponseEntity<PedidoResponse> atualizarPedido(
        @PathVariable Long id,
        @Valid @RequestBody PedidoRequest dto
    ) {
        Pedido atualizado = service.atualizarPedido(id, dto);
        return ResponseEntity.ok(pedidoMapper.toResponse(atualizado));
    }

    // DELETE /api/pedidos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
