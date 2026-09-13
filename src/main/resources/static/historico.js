let movimentacoes = [];

const el = {
    busca: document.getElementById('busca'),
    filtroTipo: document.getElementById('filtroTipo'),
    alerta: document.getElementById('alerta'),
    corpoTabela: document.getElementById('corpoTabela'),
    vazio: document.getElementById('vazio')
};

function mostrarErro(mensagem) {
    el.alerta.textContent = mensagem;
    el.alerta.classList.remove('oculto');
}

function renderTabela() {
    const termo = el.busca.value.trim().toLowerCase();
    const tipo = el.filtroTipo.value;

    const filtradas = [];
    for (let i = 0; i < movimentacoes.length; i++) {
        const m = movimentacoes[i];
        if (termo && m.produto.nome.toLowerCase().indexOf(termo) === -1) {
            continue;
        }
        if (tipo && m.tipo !== tipo) {
            continue;
        }
        filtradas.push(m);
    }

    if (filtradas.length > 0) {
        el.vazio.classList.add('oculto');
    } else {
        el.vazio.classList.remove('oculto');
    }

    let html = '';
    for (let i = 0; i < filtradas.length; i++) {
        html = html + linhaMovimentacao(filtradas[i]);
    }
    el.corpoTabela.innerHTML = html;
}

function linhaMovimentacao(m) {
    let classeTipo = 'tipo-saida';
    let rotuloTipo = 'Saída';
    if (m.tipo === 'entrada') {
        classeTipo = 'tipo-entrada';
        rotuloTipo = 'Entrada';
    }

    return '' +
        '<tr>' +
        '  <td class="num">' + formatarData(m.data) + '</td>' +
        '  <td>' + m.produto.nome + '</td>' +
        '  <td><span class="selo-tipo ' + classeTipo + '">' + rotuloTipo + '</span></td>' +
        '  <td class="num">' + m.quantidade + '</td>' +
        '</tr>';
}

el.busca.addEventListener('input', renderTabela);
el.filtroTipo.addEventListener('change', renderTabela);

function ordenarPorDataDesc(a, b) {
    return new Date(b.data) - new Date(a.data);
}

async function carregar() {
    try {
        movimentacoes = await listarMovimentacoes();
        movimentacoes.sort(ordenarPorDataDesc);
        renderTabela();
    } catch (erro) {
        mostrarErro('Não foi possível carregar o histórico: ' + erro.message);
    }
}

carregar();