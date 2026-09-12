package com.estoqueTI.estoque.repository;

import com.estoqueTI.estoque.model.MovimentacaoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimentacaoRepository extends JpaRepository<MovimentacaoEstoque, Long> {

    @Query("SELECT m FROM MovimentacaoEstoque m WHERE m.produto.id = :produtoId ORDER BY m.data DESC")
    List<MovimentacaoEstoque> findByProdutoId(Long produtoId);
}
