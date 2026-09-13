const API_PRODUTOS = '/produtos';
const API_MOVIMENTACOES = '/movimentacoes';
const API_CATEGORIAS = '/categorias';

async function apiFetch(url, options) {
    if (!options) {
        options = {};
    }
    options.headers = { 'Content-Type': 'application/json' };

    const resposta = await fetch(url, options);

    if (!resposta.ok) {
        let mensagem = 'Erro ' + resposta.status;
        try {
            const corpo = await resposta.json();
            if (corpo.mensagem) {
                mensagem = corpo.mensagem;
            }
        } catch (erro) {
            //mensagem padrão
        }
        throw new Error(mensagem);
    }

    if (resposta.status === 204) {
        return null;
    }
    return resposta.json();
}

// Produtos
function listarProdutos() {
    return apiFetch(API_PRODUTOS);
}

function buscarProduto(id) {
    return apiFetch(API_PRODUTOS + '/' + id);
}

function criarProduto(produto) {
    return apiFetch(API_PRODUTOS, { method: 'POST', body: JSON.stringify(produto) });
}

function atualizarProduto(id, produto) {
    return apiFetch(API_PRODUTOS + '/' + id, { method: 'PUT', body: JSON.stringify(produto) });
}

function excluirProduto(id) {
    return apiFetch(API_PRODUTOS + '/' + id, { method: 'DELETE' });
}

// Movimentações
function listarMovimentacoes() {
    return apiFetch(API_MOVIMENTACOES);
}

function registrarMovimentacao(produtoId, tipo, quantidade) {
    const corpo = { produtoId: produtoId, tipo: tipo, quantidade: quantidade };
    return apiFetch(API_MOVIMENTACOES, { method: 'POST', body: JSON.stringify(corpo) });
}

// Categorias
function listarCategorias() {
    return apiFetch(API_CATEGORIAS);
}

function criarCategoria(nome) {
    return apiFetch(API_CATEGORIAS, { method: 'POST', body: JSON.stringify({ nome: nome }) });
}

// Formatação
function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(isoString) {
    return new Date(isoString).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

// Regras de negócio (client-side, espelha a lógica de produto crítico)
function isCritico(produto) {
    return produto.quantidade <= produto.quantidadeMinima;
}

function nivelEstoque(produto) {
    if (produto.quantidade <= produto.quantidadeMinima) {
        return 'critico';
    }
    if (produto.quantidade <= produto.quantidadeMinima * 1.5) {
        return 'atencao';
    }
    return 'ok';
}