package com.estoqueTI.estoque.service;

import com.estoqueTI.estoque.exception.RegraDeNegocioException;
import com.estoqueTI.estoque.model.MovimentacaoEstoque;
import com.estoqueTI.estoque.model.Produto;
import com.estoqueTI.estoque.repository.MovimentacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MovimentacaoService {

    private final MovimentacaoRepository movimentacaoRepository;
    private final ProdutoService produtoService;

    @Autowired
    public MovimentacaoService(MovimentacaoRepository movimentacaoRepository, ProdutoService produtoService) {
        this.movimentacaoRepository = movimentacaoRepository;
        this.produtoService = produtoService;
    }

    public List<MovimentacaoEstoque> listarPorProduto(Long produtoId) {
        return movimentacaoRepository.findByProdutoId(produtoId);
    }

    @Transactional
    public MovimentacaoEstoque registrar(Long produtoId, String tipo, Integer quantidade) {
        Produto produto = produtoService.buscarPorId(produtoId);

        if(quantidade <= 0){
            throw new RegraDeNegocioException("O número precisa ser maior que 0");
        }

        if (tipo.equals("entrada")) {
            produto.setQuantidade(produto.getQuantidade() + quantidade);
        } else if (tipo.equals("saida")) {
            if (produto.getQuantidade() < quantidade) {
                throw new RegraDeNegocioException("Quantidade insuficiente em estoque");
            }
            produto.setQuantidade(produto.getQuantidade() - quantidade);
        } else {
            throw new RegraDeNegocioException("Tipo de movimentação inválido: " + tipo);
        }

        produtoService.salvar(produto);

        MovimentacaoEstoque movimentacao = new MovimentacaoEstoque();
        movimentacao.setProduto(produto);
        movimentacao.setTipo(tipo);
        movimentacao.setQuantidade(quantidade);
        movimentacao.setData(LocalDateTime.now());

        return movimentacaoRepository.save(movimentacao);
    }

    public List<MovimentacaoEstoque> listarTodos() {
        return movimentacaoRepository.findAll();
    }
}
