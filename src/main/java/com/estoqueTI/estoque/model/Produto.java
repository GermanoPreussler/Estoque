package com.estoqueTI.estoque.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "produtos")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(name = "valor_unitario", nullable = false)
    private BigDecimal valorUnitario;

    @Column(name = "quantidade_minima", nullable = false)
    private Integer quantidadeMinima;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    @Column(nullable = false)
    private Boolean ativo;

    public Produto(){
    }

    public Long getId(){
        return id;
    }

    public void setNome(String nome){
        this.nome = nome;
    }

    public String getNome(){
        return nome;
    }

    public void setCategoria(Categoria categoria){
        this.categoria = categoria;
    }

    public Categoria getCategoria(){
        return categoria;
    }

    public void setQuantidade(Integer quantidade){
        this.quantidade = quantidade;
    }

    public Integer getQuantidade(){
        return quantidade;
    }

    public void setValorUnitario(BigDecimal valor){
        valorUnitario = valor;
    }

    public BigDecimal getValorUnitario(){
        return valorUnitario;
    }

    public void setQuantidadeMinima(Integer quantidadeMinima){
        this.quantidadeMinima = quantidadeMinima;
    }

    public Integer getQuantidadeMinima(){
        return quantidadeMinima;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setAtivo(Boolean ativo){
        this.ativo = ativo;
    }

    public Boolean getAtivo(){
        return ativo;
    }
}
