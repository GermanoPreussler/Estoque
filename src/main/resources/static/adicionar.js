const el = {
    alerta: document.getElementById('alerta'),
    sucesso: document.getElementById('sucesso'),
    formProduto: document.getElementById('formProduto'),
    campoNome: document.getElementById('campoNome'),
    campoCategoria: document.getElementById('campoCategoria'),
    campoQuantidade: document.getElementById('campoQuantidade'),
    campoQuantidadeMinima: document.getElementById('campoQuantidadeMinima'),
    campoValorUnitario: document.getElementById('campoValorUnitario'),
    blocoNovaCategoria: document.getElementById('blocoNovaCategoria'),
    campoNovaCategoria: document.getElementById('campoNovaCategoria')
};

const VALOR_NOVA_CATEGORIA = '__nova__';

function mostrarErro(mensagem) {
    el.sucesso.classList.add('oculto');
    el.alerta.textContent = mensagem;
    el.alerta.classList.remove('oculto');
    setTimeout(function () {
        el.alerta.classList.add('oculto');
    }, 5000);
}

function mostrarSucesso(mensagem) {
    el.alerta.classList.add('oculto');
    el.sucesso.textContent = mensagem;
    el.sucesso.classList.remove('oculto');
    setTimeout(function () {
        el.sucesso.classList.add('oculto');
    }, 4000);
}

async function preencherCategorias() {
    try {
        const categorias = await listarCategorias();
        categorias.sort(function (a, b) {
            return a.nome.localeCompare(b.nome);
        });

        let opcoes = '';
        for (let i = 0; i < categorias.length; i++) {
            opcoes = opcoes + '<option value="' + categorias[i].id + '">' + categorias[i].nome + '</option>';
        }

        el.campoCategoria.innerHTML =
            '<option value="" disabled selected>Selecione uma categoria</option>' +
            opcoes +
            '<option value="' + VALOR_NOVA_CATEGORIA + '">+ Nova categoria</option>';
    } catch (erro) {
        mostrarErro('Não foi possível carregar as categorias: ' + erro.message);
    }
}

el.campoCategoria.addEventListener('change', function () {
    const ehNova = el.campoCategoria.value === VALOR_NOVA_CATEGORIA;
    if (ehNova) {
        el.blocoNovaCategoria.classList.remove('oculto');
        el.campoNovaCategoria.required = true;
        el.campoNovaCategoria.focus();
    } else {
        el.blocoNovaCategoria.classList.add('oculto');
        el.campoNovaCategoria.required = false;
    }
});

async function resolverCategoriaId() {
    if (el.campoCategoria.value !== VALOR_NOVA_CATEGORIA) {
        return Number(el.campoCategoria.value);
    }
    const criada = await criarCategoria(el.campoNovaCategoria.value.trim());
    return criada.id;
}

el.formProduto.addEventListener('submit', async function (e) {
    e.preventDefault();

    try {
        const categoriaId = await resolverCategoriaId();

        const dados = {
            nome: el.campoNome.value.trim(),
            categoriaId: categoriaId,
            quantidade: Number(el.campoQuantidade.value),
            quantidadeMinima: Number(el.campoQuantidadeMinima.value),
            valorUnitario: Number(el.campoValorUnitario.value)
        };

        const criado = await criarProduto(dados);
        mostrarSucesso('"' + criado.nome + '" cadastrado com sucesso.');
        el.formProduto.reset();
        el.blocoNovaCategoria.classList.add('oculto');
        await preencherCategorias();
        el.campoNome.focus();
    } catch (erro) {
        mostrarErro(erro.message);
    }
});

preencherCategorias();