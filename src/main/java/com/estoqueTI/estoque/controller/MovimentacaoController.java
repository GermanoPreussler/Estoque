package com.estoqueTI.estoque.controller;

import com.estoqueTI.estoque.model.MovimentacaoEstoque;
import com.estoqueTI.estoque.service.MovimentacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.estoqueTI.estoque.dto.RegistrarMovimentacaoRequest;

import java.util.List;

@RestController
@RequestMapping("/movimentacoes")
public class MovimentacaoController {

    private final MovimentacaoService movimentacaoService;

    @Autowired
    public MovimentacaoController(MovimentacaoService movimentacaoService) {
        this.movimentacaoService = movimentacaoService;
    }

    @GetMapping("/produto/{produtoId}")
    public List<MovimentacaoEstoque> listarPorProduto(@PathVariable Long produtoId) {
        return movimentacaoService.listarPorProduto(produtoId);
    }

    @GetMapping
    public List<MovimentacaoEstoque> listarTodos() {
        return movimentacaoService.listarTodos();
    }

    @PostMapping
    public MovimentacaoEstoque registrar(@Valid @RequestBody RegistrarMovimentacaoRequest request) {
        return movimentacaoService.registrar(request.getProdutoId(), request.getTipo(), request.getQuantidade());
    }
}
