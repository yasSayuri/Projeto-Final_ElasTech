package com.example.codeStore.codeStore_app.exception;

public class NegocioException extends RuntimeException{

	public NegocioException(String mensagem) {
		super(mensagem);
	}
}