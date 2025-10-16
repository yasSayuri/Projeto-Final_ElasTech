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
		Pedido produto = new Pedido();
		produto.setUsuario(usuario);
		produto.setStatus(pRequest.getStatus());
		produto.setSubtotal(pRequest.getSubtotal());
		produto.setDescontoTotal(pRequest.getDescontoTotal());
		produto.setFrete(pRequest.getFrete());
		//produto.setTotal(pRequest.getTotal()); //Acredito não ser necessário informar o total, o backend pode calcular
		return produto;
	}
	
	public PedidoResponse toResponse(Pedido produto) {
		PedidoResponse p2 = new PedidoResponse();
		p2.setUsuarioId(produto.getUsuario().getId());
		p2.setNomeUsuario(produto.getUsuario().getNome());
		p2.setStatus(produto.getStatus().name());
		p2.setSubtotal(produto.getSubtotal());
		p2.setDescontoTotal(produto.getDescontoTotal());
		p2.setFrete(produto.getFrete());
		p2.setTotal(produto.getTotal());	
		
		return p2;
	}
	
	public List<PedidoResponse> toResponseList(List<Pedido> pedidos) {
		List<PedidoResponse> response = new ArrayList<>();
		
		for(Pedido pedido: pedidos) {
			response.add(toResponse(pedido));
		}
		
		return response;	
	}	
}