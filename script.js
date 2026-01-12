let listaCompras = [];
let ultimaAtualizacao = null;

document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    carregarLista();
    
    document.getElementById('itemInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            adicionarItem();
        }
    });

    atualizarEstatisticas();
});

function carregarLista() {
    const listaSalva = localStorage.getItem('listaCompras');
    if (listaSalva) {
        listaCompras = JSON.parse(listaSalva);
        exibirLista();
        
        const ultimaAtualizacaoSalva = localStorage.getItem('ultimaAtualizacao');
        if (ultimaAtualizacaoSalva) {
            ultimaAtualizacao = new Date(ultimaAtualizacaoSalva);
            document.getElementById('ultimaAtualizacao').textContent = 
                formatarData(ultimaAtualizacao);
        }
    }
}

function salvarLista() {
    localStorage.setItem('listaCompras', JSON.stringify(listaCompras));
    ultimaAtualizacao = new Date();
    localStorage.setItem('ultimaAtualizacao', ultimaAtualizacao.toISOString());
    document.getElementById('ultimaAtualizacao').textContent = 
        formatarData(ultimaAtualizacao);
}

function formatarData(data) {
    if (!data) return '-';
    return data.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
    });
}

function atualizarEstatisticas() {
    document.getElementById('totalItens').textContent = listaCompras.length;
}

function adicionarItem() {
    const input = document.getElementById("itemInput");
    const item = input.value.trim();

    if (item === "") {
        mostrarNotificacao("Digite um item válido!", "erro");
        input.focus();
        return;
    }

    listaCompras.push(item);
    input.value = "";
    input.focus();
    
    salvarLista();
    exibirLista();
    atualizarEstatisticas();
    mostrarNotificacao(`"${item}" adicionado à lista!`, "sucesso");
}

function removerItem() {
    if (listaCompras.length === 0) {
        mostrarNotificacao("A lista já está vazia!", "info");
        return;
    }
    
    const indice = prompt("Digite o índice do item que deseja remover:");
    
    if (indice === null || indice === "") return;

    const indiceNum = parseInt(indice);
    
    if (!isNaN(indiceNum) && indiceNum >= 0 && indiceNum < listaCompras.length) {
        const itemRemovido = listaCompras[indiceNum];
        listaCompras.splice(indiceNum, 1);
        
        salvarLista();
        exibirLista();
        atualizarEstatisticas();
        mostrarNotificacao(`"${itemRemovido}" removido da lista!`, "sucesso");
    } else {
        mostrarNotificacao("Índice inválido! Digite um número válido.", "erro");
    }
}

function atualizarItem() {
    if (listaCompras.length === 0) {
        mostrarNotificacao("Não há itens para atualizar!", "info");
        return;
    }
    
    const indice = prompt("Digite o índice do item que deseja atualizar:");
    
    if (indice === null || indice === "") return;

    const indiceNum = parseInt(indice);
    
    if (!isNaN(indiceNum) && indiceNum >= 0 && indiceNum < listaCompras.length) {
        const itemAtual = listaCompras[indiceNum];
        const novoValor = prompt(`Digite o novo valor para o item "${itemAtual}":`, itemAtual);

        if (novoValor !== null && novoValor.trim() !== "") {
            listaCompras[indiceNum] = novoValor.trim();
            
            salvarLista();
            exibirLista();
            mostrarNotificacao(`Item atualizado: "${novoValor.trim()}"`, "sucesso");
        }
    } else {
        mostrarNotificacao("Índice inválido! Digite um número válido.", "erro");
    }
}

function limparLista() {
    if (listaCompras.length === 0) {
        mostrarNotificacao("A lista já está vazia!", "info");
        return;
    }
    
    if (confirm("Tem certeza que deseja limpar toda a lista?")) {
        listaCompras = [];
        
        salvarLista();
        exibirLista();
        atualizarEstatisticas();
        mostrarNotificacao("Lista limpa com sucesso!", "sucesso");
    }
}

function exibirLista() {
    const resultado = document.getElementById("resultado");
    
    if (listaCompras.length === 0) {
        resultado.innerHTML = '<p class="lista-vazia">Sua lista está vazia. Adicione alguns itens para começar!</p>';
        return;
    }

    let html = '';
    
    listaCompras.forEach((item, index) => {
        html += `
        <div class="item-lista">
            <div class="item-conteudo">
                <span class="item-indice">${index}</span>
                <span class="item-texto">${item}</span>
            </div>
            <div class="item-acoes">
                <button class="btn-acao" onclick="editarItem(${index})" title="Editar item">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-acao" onclick="removerItemEspecifico(${index})" title="Remover item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        `;
    });

    resultado.innerHTML = html;
}

function editarItem(index) {
    const itemAtual = listaCompras[index];
    const novoValor = prompt(`Editar item "${itemAtual}":`, itemAtual);
    
    if (novoValor !== null && novoValor.trim() !== "") {
        listaCompras[index] = novoValor.trim();
        
        salvarLista();
        exibirLista();
        mostrarNotificacao(`Item atualizado!`, "sucesso");
    }
}

function removerItemEspecifico(index) {
    if (confirm(`Remover "${listaCompras[index]}" da lista?`)) {
        const itemRemovido = listaCompras[index];
        listaCompras.splice(index, 1);
        
        salvarLista();
        exibirLista();
        atualizarEstatisticas();
        mostrarNotificacao(`"${itemRemovido}" removido da lista!`, "sucesso");
    }
}

function mostrarNotificacao(mensagem, tipo) {
    const notificacoesAnteriores = document.querySelectorAll('.notificacao');
    notificacoesAnteriores.forEach(notif => notif.remove());
    
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.textContent = mensagem;
    
    Object.assign(notificacao.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '600',
        zIndex: '1000',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        animation: 'slideIn 0.3s ease-out'
    });
    
    if (tipo === 'sucesso') {
        notificacao.style.backgroundColor = '#27ae60';
    } else if (tipo === 'erro') {
        notificacao.style.backgroundColor = '#e74c3c';
    } else {
        notificacao.style.backgroundColor = '#3498db';
    }
    
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notificacao.remove(), 300);
    }, 3000);
    
    if (!document.querySelector('#notificacao-animacoes')) {
        const style = document.createElement('style');
        style.id = 'notificacao-animacoes';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}
