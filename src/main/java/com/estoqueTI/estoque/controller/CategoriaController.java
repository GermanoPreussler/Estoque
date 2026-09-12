package com.estoqueTI.estoque.controller;

import com.estoqueTI.estoque.dto.CategoriaRequest;
import com.estoqueTI.estoque.model.Categoria;
import com.estoqueTI.estoque.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    @Autowired
    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping
    public List<Categoria> listarTodas() {
        return categoriaService.listarTodas();
    }

    @PostMapping
    public Categoria criar(@Valid @RequestBody CategoriaRequest request) {
        return categoriaService.criar(request.getNome());
    }
}
