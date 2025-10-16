package com.example.codeStore.codeStore_app.dto.mapper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.example.codeStore.codeStore_app.dto.request.PedidoRequest;
import com.example.codeStore.codeStore_app.dto.response.PedidoResponse;
import com.example.codeStore.codeStore_app.model.Pedido;
import com.example.codeStore.codeStore_app.model.Usuario;

@Component
public class PedidoMapper {

    public Pedido toEntity(PedidoRequest pRequest, Usuario usuario) {
        Pedido p = new Pedido();
        p.setUsuario(usuario);
        p.setStatus(pRequest.getStatus());
        p.setSubtotal(pRequest.getSubtotal());
        p.setDescontoTotal(pRequest.getDescontoTotal());
        // frete/total serão calculados na service
        return p;
    }

    public PedidoResponse toResponse(Pedido p) {
        PedidoResponse r = new PedidoResponse();
        r.setId(p.getId());                                 // <<=== ADICIONADO
        r.setUsuarioId(p.getUsuario() != null ? p.getUsuario().getId() : null);
        r.setNomeUsuario(p.getUsuario() != null ? p.getUsuario().getNome() : null);
        r.setStatus(p.getStatus() != null ? p.getStatus().name() : null);
        r.setSubtotal(p.getSubtotal());
        r.setDescontoTotal(p.getDescontoTotal());
        r.setFrete(p.getFrete());
        r.setTotal(p.getTotal());
        return r;
    }

    public List<PedidoResponse> toResponseList(List<Pedido> pedidos) {
        List<PedidoResponse> list = new ArrayList<>();
        for (Pedido p : pedidos) list.add(toResponse(p));
        return list;
    }
}
