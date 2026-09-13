let categorias = [];
let produtos = [];
const VALOR_NOVA_CATEGORIA = '__nova__';

const el = {
    editarBlocoNovaCategoria: document.getElementById('editarBlocoNovaCategoria'),
    editarNovaCategoria: document.getElementById('editarNovaCategoria'),
    stats: document.getElementById('stats'),
    busca: document.getElementById('busca'),
    filtroCategoria: document.getElementById('filtroCategoria'),
    apenasCriticos: document.getElementById('apenasCriticos'),
    alerta: document.getElementById('alerta'),
    corpoTabela: document.getElementById('corpoTabela'),
    vazio: document.getElementById('vazio'),

    modalEditarOverlay: document.getElementById('modalEditarOverlay'),
    formEditar: document.getElementById('formEditar'),
    editarId: document.getElementById('editarId'),
    editarNome: document.getElementById('editarNome'),
    editarCategoria: document.getElementById('editarCategoria'),
    editarQuantidadeMinima: document.getElementById('editarQuantidadeMinima'),
    editarValorUnitario: document.getElementById('editarValorUnitario'),
    editarQuantidadeAtual: document.getElementById('editarQuantidadeAtual'),
    btnFecharEditar: document.getElementById('btnFecharEditar'),
    btnCancelarEditar: document.getElementById('btnCancelarEditar'),

    modalMovimentarOverlay: document.getElementById('modalMovimentarOverlay'),
    formMovimentar: document.getElementById('formMovimentar'),
    movimentarId: document.getElementById('movimentarId'),
    movimentarNome: document.getElementById('movimentarNome'),
    movimentarTipo: document.getElementById('movimentarTipo'),
    movimentarQuantidade: document.getElementById('movimentarQuantidade'),
    btnFecharMovimentar: document.getElementById('btnFecharMovimentar'),
    btnCancelarMovimentar: document.getElementById('btnCancelarMovimentar')
};

function mostrarErro(mensagem) {
    el.alerta.textContent = mensagem;
    el.alerta.classList.remove('oculto');
    setTimeout(function () {
        el.alerta.classList.add('oculto');
    }, 5000);
}

// ---------- Busca de um produto pelo id ----------

function encontrarProduto(id) {
    for (let i = 0; i < produtos.length; i++) {
        if (produtos[i].id === id) {
            return produtos[i];
        }
    }
    return null;
}

// ---------- Render ----------

function renderStats(lista) {
    const totalItens = lista.length;
    let valorTotal = 0;
    let criticos = 0;

    for (let i = 0; i < lista.length; i++) {
        valorTotal = valorTotal + (Number(lista[i].valorUnitario) * lista[i].quantidade);
        if (isCritico(lista[i])) {
            criticos = criticos + 1;
        }
    }

    el.stats.innerHTML =
        '<div class="stat"><span class="valor">' + totalItens + '</span><span class="rotulo">Produtos</span></div>' +
        '<div class="stat"><span class="valor">' + formatarMoeda(valorTotal) + '</span><span class="rotulo">Valor em estoque</span></div>' +
        '<div class="stat critico"><span class="valor">' + criticos + '</span><span class="rotulo">Críticos</span></div>';
}

function renderCategoriasFiltro() {
    const selecaoAtual = el.filtroCategoria.value;

    const ordenadas = categorias.slice();
    ordenadas.sort(function (a, b) {
        return a.nome.localeCompare(b.nome);
    });

    let opcoes = '';
    for (let i = 0; i < ordenadas.length; i++) {
        opcoes = opcoes + '<option value="' + ordenadas[i].id + '">' + ordenadas[i].nome + '</option>';
    }

    el.filtroCategoria.innerHTML = '<option value="">Todas as categorias</option>' + opcoes;
    el.filtroCategoria.value = selecaoAtual;
}

function renderCategoriasEditar() {
    const ordenadas = categorias.slice();
    ordenadas.sort(function (a, b) {
        return a.nome.localeCompare(b.nome);
    });

    let opcoes = '';
    for (let i = 0; i < ordenadas.length; i++) {
        opcoes = opcoes + '<option value="' + ordenadas[i].id + '">' + ordenadas[i].nome + '</option>';
    }

    el.editarCategoria.innerHTML = opcoes + '<option value="' + VALOR_NOVA_CATEGORIA + '">+ Nova categoria</option>';
}

async function carregarCategorias() {
    categorias = await listarCategorias();
}

function renderTabela() {
    const termo = el.busca.value.trim().toLowerCase();
    const categoria = el.filtroCategoria.value;
    const somenteCriticos = el.apenasCriticos.checked;

    const filtrados = [];
    for (let i = 0; i < produtos.length; i++) {
        const p = produtos[i];
        if (termo && p.nome.toLowerCase().indexOf(termo) === -1) {
            continue;
        }
        if (categoria && String(p.categoria.id) !== categoria) {
            continue;
        }
        if (somenteCriticos && !isCritico(p)) {
            continue;
        }
        filtrados.push(p);
    }

    if (filtrados.length > 0) {
        el.vazio.classList.add('oculto');
    } else {
        el.vazio.classList.remove('oculto');
    }

    let html = '';
    for (let i = 0; i < filtrados.length; i++) {
        html = html + linhaProduto(filtrados[i]);
    }
    el.corpoTabela.innerHTML = html;

    const botoesAjustar = el.corpoTabela.querySelectorAll('[data-ajustar]');
    for (let i = 0; i < botoesAjustar.length; i++) {
        botoesAjustar[i].addEventListener('click', criarHandlerAjustar(botoesAjustar[i]));
    }

    const botoesEditar = el.corpoTabela.querySelectorAll('[data-editar]');
    for (let i = 0; i < botoesEditar.length; i++) {
        botoesEditar[i].addEventListener('click', criarHandlerEditar(botoesEditar[i]));
    }

    const botoesExcluir = el.corpoTabela.querySelectorAll('[data-excluir]');
    for (let i = 0; i < botoesExcluir.length; i++) {
        botoesExcluir[i].addEventListener('click', criarHandlerExcluir(botoesExcluir[i]));
    }
}

// Funções que "fabricam" o handler de clique, evitando arrow function no addEventListener.
function criarHandlerAjustar(botao) {
    return function () {
        abrirModalMovimentar(Number(botao.dataset.ajustar));
    };
}

function criarHandlerEditar(botao) {
    return function () {
        abrirModalEditar(Number(botao.dataset.editar));
    };
}

function criarHandlerExcluir(botao) {
    return function () {
        confirmarExclusao(Number(botao.dataset.excluir));
    };
}

function linhaProduto(p) {
    const nivel = nivelEstoque(p);
    let percentual = (p.quantidade / (p.quantidadeMinima * 2 || 1)) * 100;
    if (percentual > 100) {
        percentual = 100;
    }
    const valorTotal = Number(p.valorUnitario) * p.quantidade;

    let seloCritico = '';
    if (nivel === 'critico') {
        seloCritico = '<span class="selo-critico">Estoque baixo</span>';
    }

    return '' +
        '<tr>' +
        '  <td>' +
        '    <div class="nome-produto">' + p.nome + '</div>' +
        '    ' + seloCritico +
        '  </td>' +
        '  <td><span class="categoria-tag">' + p.categoria.nome + '</span></td>' +
        '  <td>' +
        '    <div class="nivel-estoque">' +
        '      <span class="nivel-numero">' + p.quantidade + ' / ' + p.quantidadeMinima + '</span>' +
        '      <div class="nivel-barra-fundo">' +
        '        <div class="nivel-barra-preenchimento nivel-' + nivel + '" style="width:' + percentual + '%"></div>' +
        '      </div>' +
        '    </div>' +
        '  </td>' +
        '  <td class="num">' + formatarMoeda(p.valorUnitario) + '</td>' +
        '  <td class="num">' + formatarMoeda(valorTotal) + '</td>' +
        '  <td>' +
        '    <div class="acoes-linha">' +
        '      <button type="button" data-ajustar="' + p.id + '" title="Ajustar estoque">ajustar</button>' +
        '      <button type="button" data-editar="' + p.id + '" title="Editar dados">editar</button>' +
        '      <button type="button" class="excluir" data-excluir="' + p.id + '" title="Excluir">excluir</button>' +
        '    </div>' +
        '  </td>' +
        '</tr>';
}

// ---------- Modal: editar dados ----------

function abrirModalEditar(id) {
    const p = encontrarProduto(id);
    el.editarId.value = p.id;
    el.editarNome.value = p.nome;
    renderCategoriasEditar();
    el.editarCategoria.value = p.categoria.id;
    el.editarBlocoNovaCategoria.classList.add('oculto');
    el.editarNovaCategoria.value = '';
    el.editarQuantidadeMinima.value = p.quantidadeMinima;
    el.editarValorUnitario.value = p.valorUnitario;
    el.editarQuantidadeAtual.textContent = p.quantidade;
    el.modalEditarOverlay.classList.remove('oculto');
    el.editarNome.focus();
}

function fecharModalEditar() {
    el.modalEditarOverlay.classList.add('oculto');
}

el.formEditar.addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = el.editarId.value;
    const produtoAtual = encontrarProduto(Number(id));

    try {
        let categoriaId;
        if (el.editarCategoria.value === VALOR_NOVA_CATEGORIA) {
            const criada = await criarCategoria(el.editarNovaCategoria.value.trim());
            categoriaId = criada.id;
        } else {
            categoriaId = Number(el.editarCategoria.value);
        }

        const dados = {
            nome: el.editarNome.value.trim(),
            categoriaId: categoriaId,
            quantidade: produtoAtual.quantidade, // não alterado por este formulário
            quantidadeMinima: Number(el.editarQuantidadeMinima.value),
            valorUnitario: Number(el.editarValorUnitario.value)
        };

        await atualizarProduto(id, dados);
        fecharModalEditar();
        await carregarCategorias();
        await atualizar();
    } catch (erro) {
        mostrarErro(erro.message);
    }
});

// ---------- Modal: ajustar estoque (movimentação) ----------

function abrirModalMovimentar(id) {
    const p = encontrarProduto(id);
    el.movimentarId.value = p.id;
    el.movimentarNome.textContent = p.nome + ' — estoque atual: ' + p.quantidade;
    el.movimentarTipo.value = 'entrada';
    el.movimentarQuantidade.value = '';
    el.modalMovimentarOverlay.classList.remove('oculto');
    el.movimentarQuantidade.focus();
}

function fecharModalMovimentar() {
    el.modalMovimentarOverlay.classList.add('oculto');
}

el.formMovimentar.addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = Number(el.movimentarId.value);
    const tipo = el.movimentarTipo.value;
    const quantidade = Number(el.movimentarQuantidade.value);

    try {
        await registrarMovimentacao(id, tipo, quantidade);
        fecharModalMovimentar();
        await atualizar();
    } catch (erro) {
        mostrarErro(erro.message);
    }
});

// ---------- Excluir ----------

async function confirmarExclusao(id) {
    const p = encontrarProduto(id);
    if (!confirm('Excluir "' + p.nome + '" do estoque?')) {
        return;
    }

    try {
        await excluirProduto(id);
        await atualizar();
    } catch (erro) {
        mostrarErro(erro.message);
    }
}

// ---------- Eventos gerais ----------

el.btnFecharEditar.addEventListener('click', fecharModalEditar);
el.btnCancelarEditar.addEventListener('click', fecharModalEditar);
el.modalEditarOverlay.addEventListener('click', function (e) {
    if (e.target === el.modalEditarOverlay) {
        fecharModalEditar();
    }
});

el.btnFecharMovimentar.addEventListener('click', fecharModalMovimentar);
el.btnCancelarMovimentar.addEventListener('click', fecharModalMovimentar);
el.modalMovimentarOverlay.addEventListener('click', function (e) {
    if (e.target === el.modalMovimentarOverlay) {
        fecharModalMovimentar();
    }
});

el.busca.addEventListener('input', renderTabela);
el.filtroCategoria.addEventListener('change', renderTabela);
el.apenasCriticos.addEventListener('change', renderTabela);
el.editarCategoria.addEventListener('change', function () {
    const ehNova = el.editarCategoria.value === VALOR_NOVA_CATEGORIA;
    if (ehNova) {
        el.editarBlocoNovaCategoria.classList.remove('oculto');
        el.editarNovaCategoria.required = true;
        el.editarNovaCategoria.focus();
    } else {
        el.editarBlocoNovaCategoria.classList.add('oculto');
        el.editarNovaCategoria.required = false;
    }
});

// ---------- Bootstrap ----------

async function atualizar() {
    try {
        produtos = await listarProdutos();
        renderStats(produtos);
        renderCategoriasFiltro();
        renderTabela();
    } catch (erro) {
        mostrarErro('Não foi possível carregar os produtos: ' + erro.message);
    }
}

async function iniciar() {
    try {
        await carregarCategorias();
    } catch (erro) {
        mostrarErro('Não foi possível carregar as categorias: ' + erro.message);
    }
    await atualizar();
}

iniciar();