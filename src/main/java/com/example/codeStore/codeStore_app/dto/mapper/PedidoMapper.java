package com.example.codeStore.codeStore_app.dto.mapper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.example.codeStore.codeStore_app.dto.request.PedidoRequest;
import com.example.codeStore.codeStore_app.dto.response.PedidoResponse;
import com.example.codeStore.codeStore_app.dto.response.ProdutoResponse;
import com.example.codeStore.codeStore_app.model.Pedido;
import com.example.codeStore.codeStore_app.model.Usuario;
import com.example.codeStore.codeStore_app.model.PedidoProduto;

@Component
public class PedidoMapper {
    public Pedido toEntity(PedidoRequest pRequest, Usuario usuario) {
        Pedido p = new Pedido();
        p.setUsuario(usuario);
        p.setStatus(pRequest.getStatus());
        // frete/total serão calculados na service
        return p;
    }
    
    public PedidoResponse toResponse(Pedido pedido) {
        PedidoResponse dto = new PedidoResponse();
        dto.setId(pedido.getId());
        //dto.setUsuarioId(pedido.getUsuario() != null ? pedido.getUsuario().getId() : null);
        dto.setNomeUsuario(pedido.getUsuario() != null ? pedido.getUsuario().getNome() : null);
        dto.setStatus(pedido.getStatus() != null ? pedido.getStatus().name() : null);
        dto.setSubtotal(pedido.getSubtotal());
        dto.setDescontoTotal(pedido.getDescontoTotal());
        dto.setFrete(pedido.getFrete());
        dto.setTotal(pedido.getTotal());

        List<ProdutoResponse> produtos = new ArrayList<>();
        for (PedidoProduto pp : pedido.getPedidoProdutos()) {
        	ProdutoResponse item = new ProdutoResponse();
            item.setId(pp.getProduto().getId());
            item.setNome(pp.getProduto().getNome());
            item.setDescricao(pp.getProduto().getDescricao());
            item.setPreco(pp.getProduto().getPreco());
            item.setCategoriaProduto(pp.getProduto().getCategoriaProduto().name());
            item.setQuantidade(pp.getQuantidade());
            produtos.add(item);
        }
        dto.setProdutos(produtos);

        return dto;
    }

    public List<PedidoResponse> toResponseList(List<Pedido> pedidos) {
        List<PedidoResponse> response = new ArrayList<>();
        for (Pedido pedido : pedidos) {
            response.add(toResponse(pedido));
        }
        return response;
    }
}
