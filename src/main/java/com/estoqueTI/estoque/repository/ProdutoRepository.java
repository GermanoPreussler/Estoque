package com.estoqueTI.estoque.repository;

import com.estoqueTI.estoque.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    //importa findById() findALl() deletebyID() count() + outros
    List<Produto> findByAtivoTrue();
}
