package com.example.codeStore.codeStore_app.service;


import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.codeStore.codeStore_app.model.PedidoModel;
import com.example.codeStore.codeStore_app.repository.PedidoRepository;

@Service
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository repository;

    public PedidoServiceImpl(PedidoRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoModel> obterTodos() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public PedidoModel obterPorId(Long id) {
        return repository.findById(id).get();
//                .orElseThrow(() -> new RecursoNaoEncontradoException("Pedido não encontrado: " + id));
    }

    @Override
    @Transactional
    public PedidoModel cadastrarPedido(PedidoModel novo) {
        normalizarValores(novo);
        aplicarFreteERecalcularTotal(novo);
        return repository.save(novo);
    }

    @Override
    @Transactional
    public PedidoModel atualizarPedido(Long id, PedidoModel atualizacao) {
        PedidoModel existente = obterPorId(id);

        // Atualiza campos editáveis
        existente.setUsuarioId(atualizacao.getUsuarioId());
        existente.setStatus(atualizacao.getStatus());
        existente.setSubtotal(zeroSeNulo(atualizacao.getSubtotal()));
        existente.setDescontoTotal(zeroSeNulo(atualizacao.getDescontoTotal()));

        // frete e total sempre recalculados pela regra de negócio
        aplicarFreteERecalcularTotal(existente);

        return repository.save(existente);
    }

    /* ================== REGRAS DE NEGÓCIO ================== */

    // Regra exemplo: frete grátis para subtotal >= 200; caso contrário, frete fixo 20.00
    private void aplicarFreteERecalcularTotal(PedidoModel pedido) {
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

    private void normalizarValores(PedidoModel p) {
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
