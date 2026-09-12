package com.estoqueTI.estoque.service;

import com.estoqueTI.estoque.model.Categoria;
import com.estoqueTI.estoque.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    @Autowired
    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<Categoria> listarTodas() {
        return categoriaRepository.findAll();
    }

    public Categoria criar(String nome) {
        Optional<Categoria> existente = categoriaRepository.findByNomeIgnoreCase(nome);
        if (existente.isPresent()) {
            return existente.get();
        }

        Categoria categoria = new Categoria();
        categoria.setNome(nome);
        return categoriaRepository.save(categoria);
    }
}
