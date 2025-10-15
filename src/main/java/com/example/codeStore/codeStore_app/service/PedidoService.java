package com.example.codeStore.codeStore_app.service;


import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.codeStore.codeStore_app.dto.mapper.PedidoMapper;
import com.example.codeStore.codeStore_app.dto.request.PedidoRequest;
import com.example.codeStore.codeStore_app.model.Pedido;
import com.example.codeStore.codeStore_app.repository.PedidoRepository;

@Service
public class PedidoService {

    private final PedidoRepository repository;
    private final PedidoMapper pedidoMapper;

    public PedidoService(PedidoRepository repository, PedidoMapper pedidoMapper) {
        this.repository = repository;
        this.pedidoMapper = pedidoMapper;
    }

    @Transactional(readOnly = true)
    public List<Pedido> obterTodos() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Pedido obterPorId(Long id) {
        return repository.findById(id).get();
    }

    @Transactional
    public Pedido cadastrarPedido(PedidoRequest dto) {
    	Pedido pedido = pedidoMapper.toEntity(dto); 
        normalizarValores(pedido);
        aplicarFreteERecalcularTotal(pedido);
        return repository.save(pedido);
    }

    @Transactional
    public Pedido atualizarPedido(Long id, PedidoRequest dto) {
        Pedido existente = obterPorId(id);

        // Atualiza campos editáveis
        existente.setUsuarioId(dto.getUsuarioId());
        existente.setStatus(dto.getStatus());
        existente.setSubtotal(zeroSeNulo(dto.getSubtotal()));
        existente.setDescontoTotal(zeroSeNulo(dto.getDescontoTotal()));

        // frete e total sempre recalculados pela regra de negócio
        aplicarFreteERecalcularTotal(existente);

        return repository.save(existente);
    }

    /* ================== REGRAS DE NEGÓCIO ================== */

    // Regra exemplo: frete grátis para subtotal >= 200; caso contrário, frete fixo 20.00
    private void aplicarFreteERecalcularTotal(Pedido pedido) {
        BigDecimal subtotal = pedido.getSubtotal();
        BigDecimal desconto = pedido.getDescontoTotal();

        BigDecimal frete;
        if (subtotal.compareTo(new BigDecimal("200.00")) >= 0) {
            frete = BigDecimal.ZERO;
        } else {
            frete = new BigDecimal("20.00");
        }

        BigDecimal total = subtotal
                .subtract(desconto != null ? desconto : BigDecimal.ZERO)
                .add(frete);

        // Evita total negativo
        if (total.compareTo(BigDecimal.ZERO) < 0) {
            total = BigDecimal.ZERO;
        }

        pedido.setFrete(frete.setScale(2));
        pedido.setTotal(total.setScale(2));
    }

    private void normalizarValores(Pedido p) {
        p.setSubtotal(zeroSeNulo(p.getSubtotal()));
        p.setDescontoTotal(zeroSeNulo(p.getDescontoTotal()));
        // frete e total serão setados pela regra
        p.setFrete(BigDecimal.ZERO);
        p.setTotal(BigDecimal.ZERO);
    }

    private BigDecimal zeroSeNulo(BigDecimal v) {
        return v == null ? BigDecimal.ZERO : v.setScale(2);
    }
}
