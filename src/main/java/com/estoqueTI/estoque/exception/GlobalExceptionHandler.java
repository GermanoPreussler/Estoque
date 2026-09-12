package com.estoqueTI.estoque.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<Map<String, Object>> tratarRecursoNaoEncontrado(RecursoNaoEncontradoException ex) {
        return construirResposta(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(RegraDeNegocioException.class)
    public ResponseEntity<Map<String, Object>> tratarRegraDeNegocio(RegraDeNegocioException ex) {
        return construirResposta(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> tratarIntegridade(org.springframework.dao.DataIntegrityViolationException ex) {
        return construirResposta(HttpStatus.BAD_REQUEST, "Dados inválidos ou violam uma restrição do banco de dados.");
    }

    private ResponseEntity<Map<String, Object>> construirResposta(HttpStatus status, String mensagem) {
        Map<String, Object> corpo = new HashMap<>();
        corpo.put("timestamp", LocalDateTime.now());
        corpo.put("status", status.value());
        corpo.put("erro", status.getReasonPhrase());
        corpo.put("mensagem", mensagem);
        return ResponseEntity.status(status).body(corpo);
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> tratarValidacao(org.springframework.web.bind.MethodArgumentNotValidException ex) {
        String mensagem = ex.getBindingResult().getFieldErrors().stream()
                .map(erro -> erro.getField() + ": " + erro.getDefaultMessage())
                .collect(java.util.stream.Collectors.joining("; "));
        return construirResposta(HttpStatus.BAD_REQUEST, mensagem);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> tratarGenerico(Exception ex) {
        return construirResposta(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno no servidor.");
    }

}