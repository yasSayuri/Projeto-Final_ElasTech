package com.example.codeStore.codeStore_app.service;

import java.math.BigDecimal;
import java.util.List;
import java.math.RoundingMode;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.codeStore.codeStore_app.dto.mapper.PedidoMapper;
import com.example.codeStore.codeStore_app.dto.request.PedidoRequest;
import com.example.codeStore.codeStore_app.exception.EntidadeNaoEncontradaException;
import com.example.codeStore.codeStore_app.model.Pedido;
import com.example.codeStore.codeStore_app.model.Usuario;
import com.example.codeStore.codeStore_app.repository.PedidoRepository;
import com.example.codeStore.codeStore_app.repository.UsuarioRepository;

@Service
public class PedidoService {

    private final PedidoRepository repository;
    private final PedidoMapper pedidoMapper;
    private final UsuarioRepository usuarioRepository;

    public PedidoService(
            PedidoRepository repository,
            PedidoMapper pedidoMapper,
            UsuarioRepository usuarioRepository
    ) {
        this.repository = repository;
        this.pedidoMapper = pedidoMapper;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<Pedido> obterTodos() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Pedido obterPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Pedido não encontrado!"));
    }

    @Transactional(readOnly = true)
    public List<Pedido> obterPorUsuario(Long usuarioId) {
        // ordena do mais recente para o mais antigo
        return repository.findByUsuario_IdOrderByIdDesc(usuarioId);
    }

    @Transactional
    public Pedido cadastrarPedido(PedidoRequest dto) {
        // garante que o usuário existe
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new EntidadeNaoEncontradaException("Usuário não encontrado!"));

        // mapeia request -> entity já amarrando o usuário
        Pedido pedido = pedidoMapper.toEntity(dto, usuario);

        // normaliza e aplica regra de frete/total
        normalizarValores(pedido);
        aplicarFreteERecalcularTotal(pedido);

        return repository.save(pedido);
    }

    @Transactional
    public Pedido atualizarPedido(Long id, PedidoRequest dto) {
        Pedido existente = obterPorId(id);

        // campos editáveis vindos do request
        existente.setStatus(dto.getStatus());
        existente.setSubtotal(zeroSeNulo(dto.getSubtotal()));
        existente.setDescontoTotal(zeroSeNulo(dto.getDescontoTotal()));

        // frete/total sempre calculados pela regra
        aplicarFreteERecalcularTotal(existente);

        return repository.save(existente);
    }

    @Transactional
    public void excluir(Long id) {
        repository.deleteById(id);
    }

    /* ================== REGRAS DE NEGÓCIO ================== */

    // frete grátis p/ subtotal >= 200; caso contrário, frete 20.00
    private void aplicarFreteERecalcularTotal(Pedido pedido) {
        BigDecimal subtotal = pedido.getSubtotal();
        BigDecimal desconto = pedido.getDescontoTotal();

        BigDecimal frete = (subtotal.compareTo(new BigDecimal("200.00")) >= 0)
                ? BigDecimal.ZERO
                : new BigDecimal("20.00");

        BigDecimal total = subtotal
                .subtract(desconto != null ? desconto : BigDecimal.ZERO)
                .add(frete);

        if (total.compareTo(BigDecimal.ZERO) < 0) {
            total = BigDecimal.ZERO;
        }

        pedido.setFrete(frete.setScale(2));
        pedido.setTotal(total.setScale(2));
    }

    private void normalizarValores(Pedido p) {
        p.setSubtotal(zeroSeNulo(p.getSubtotal()));
        p.setDescontoTotal(zeroSeNulo(p.getDescontoTotal()));
        // frete e total serão recalculados
        p.setFrete(BigDecimal.ZERO);
        p.setTotal(BigDecimal.ZERO);
    }

    private BigDecimal zeroSeNulo(BigDecimal v) {
        return (v == null ? BigDecimal.ZERO : v).setScale(2, RoundingMode.HALF_UP);
    }
}
