package com.estoqueTI.estoque.service;

import com.estoqueTI.estoque.dto.ProdutoRequest;
import com.estoqueTI.estoque.exception.RecursoNaoEncontradoException;
import com.estoqueTI.estoque.model.Categoria;
import com.estoqueTI.estoque.model.Produto;
import com.estoqueTI.estoque.repository.CategoriaRepository;
import com.estoqueTI.estoque.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;

    @Autowired
    public ProdutoService(ProdutoRepository produtoRepository, CategoriaRepository categoriaRepository) {
        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public List<Produto> listarTodos() {
        return produtoRepository.findByAtivoTrue();
    }

    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Produto não encontrado com id: " + id));
    }

    public Produto salvar(Produto produto) {
        return produtoRepository.save(produto);
    }

    public Produto criar(ProdutoRequest request) {
        Categoria categoria = buscarCategoria(request.getCategoriaId());

        Produto produto = new Produto();
        produto.setNome(request.getNome());
        produto.setCategoria(categoria);
        produto.setQuantidade(request.getQuantidade());
        produto.setQuantidadeMinima(request.getQuantidadeMinima());
        produto.setValorUnitario(request.getValorUnitario());
        produto.setAtivo(true);

        return produtoRepository.save(produto);
    }

    public Produto atualizar(Long id, ProdutoRequest request) {
        Produto produto = buscarPorId(id); // 404 automático se o id não existir

        Categoria categoria = buscarCategoria(request.getCategoriaId());

        produto.setNome(request.getNome());
        produto.setCategoria(categoria);
        produto.setQuantidadeMinima(request.getQuantidadeMinima());
        produto.setValorUnitario(request.getValorUnitario());

        return produtoRepository.save(produto);
    }

    private Categoria buscarCategoria(Long categoriaId) {
        return categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria não encontrada com id: " + categoriaId));
    }

    public void deletar(Long id) {
        Produto produto = buscarPorId(id);
        produto.setAtivo(false);
        produtoRepository.save(produto);
    }
}
