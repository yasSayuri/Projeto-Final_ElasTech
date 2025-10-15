// ==================== CONFIG/API & HELPERS ====================
const API = "http://localhost:8080/api/pedidos";

function getPedidoId() { return localStorage.getItem('pedidoId'); }
function setPedidoId(id) { localStorage.setItem('pedidoId', String(id)); }
function clearPedidoId() { localStorage.removeItem('pedidoId'); }

function calcularTotais(carrinho){
  const subtotal = carrinho.reduce((acc, p) => acc + (p.preco * p.quantidade), 0);
  const frete = subtotal >= 200 ? 0 : (subtotal > 0 ? 20 : 0);
  const total = subtotal + frete;
  return { subtotal, frete, total };
}

/** Cria/atualiza/deleta o pedido no backend conforme o carrinho */
async function syncPedidoBackend(statusOverride){
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const { subtotal, frete } = calcularTotais(carrinho);
  const status = statusOverride || "PENDENTE";
  const pedidoId = getPedidoId();

  // carrinho vazio -> apaga pedido se existir
  if (carrinho.length === 0) {
    if (pedidoId) {
      try { await fetch(`${API}/${pedidoId}`, { method: "DELETE" }); }
      catch(e){ console.error("Erro ao deletar pedido:", e); }
      clearPedidoId();
    }
    return;
  }

  const body = {
    usuarioId: 1,
    status,
    subtotal,
    descontoTotal: 0,
    frete
  };

  try {
    if (!pedidoId) {
      const r = await fetch(API, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(body)
      });
      const data = await r.json();
      if (data && data.id) setPedidoId(data.id);
    } else {
      await fetch(`${API}/${pedidoId}`, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ ...body, id: Number(pedidoId) })
      });
    }
  } catch(err){
    console.error("Erro ao sincronizar pedido:", err);
  }
}

// ==================== UI (Carrinho) ====================
const corpoCarrinho = document.querySelector('.cart-body');

function carregarCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  if (carrinho.length === 0) {
    corpoCarrinho.innerHTML = `<p style="padding:20px; text-align:center;">Seu carrinho está vazio!</p>`;
    atualizarTotais(); // zera totals
    return;
  }

  const produtosHTML = carrinho.map(prod => `
    <div class="cart-row" data-id="${prod.id}">
      <div class="prod">
        <div class="thumb"
             style="background-image:url('${prod.img}');
                    background-size:cover;
                    background-position:center;">
        </div>
        <div class="info">
          <p class="name">${prod.nome}</p>
          <p class="attrs">${prod.categoria}</p>
        </div>
      </div>

      <div class="price">R$ ${prod.preco.toFixed(2)}</div>

      <div class="qty">
        <button class="btn-qty" onclick="alterarQtd(${prod.id}, -1)">−</button>
        <span>${prod.quantidade}</span>
        <button class="btn-qty" onclick="alterarQtd(${prod.id}, 1)">+</button>
      </div>

      <div class="total">
        R$ ${(prod.preco * prod.quantidade).toFixed(2)}
        <span class="material-icons remove-icon" title="Remover" onclick="removerProduto(${prod.id})">delete</span>
      </div>
    </div>
  `).join('');

  corpoCarrinho.innerHTML = produtosHTML;
  atualizarTotais();
}

function alterarQtd(id, delta) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const produto = carrinho.find(p => p.id === id);
  if (!produto) return;

  produto.quantidade += delta;
  if (produto.quantidade <= 0) {
    carrinho = carrinho.filter(p => p.id !== id);
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  carregarCarrinho();
  syncPedidoBackend(); // sincroniza backend
}

function removerProduto(id) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho = carrinho.filter(p => p.id !== id);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  carregarCarrinho();
  syncPedidoBackend(); // sincroniza backend
  mostrarToast("Produto removido do carrinho!");
}

function atualizarTotais() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const els = {
    subtotal: document.querySelector(".totals .line:nth-child(1) span:last-child"),
    frete:    document.querySelector(".totals .line:nth-child(3) span:last-child"),
    total:    document.querySelector(".totals .line.total span:last-child")
  };

  if (carrinho.length === 0) {
    els.subtotal.textContent = "R$: 0.00";
    els.frete.textContent    = "R$: 0.00";
    els.total.textContent    = "R$: 0.00";
    return;
  }

  const { subtotal, frete, total } = calcularTotais(carrinho);
  els.subtotal.textContent = `R$: ${subtotal.toFixed(2)}`;
  els.frete.textContent    = `R$: ${frete.toFixed(2)}`;
  els.total.textContent    = `R$: ${total.toFixed(2)}`;
}

// ==================== Fazer Pedido (PROCESSANDO) ====================
document.getElementById('btnFazerPedido')?.addEventListener('click', async ()=>{
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  if (!carrinho.length) {
    mostrarToast("Seu carrinho está vazio!");
    return;
  }
  await syncPedidoBackend("PROCESSANDO");
  mostrarToast("Pedido enviado! Status: PROCESSANDO");
});

// ==================== Toast (fallback simples) ====================
function mostrarToast(msg){
  let t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(()=> t.classList.add('show'));
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(), 250); }, 2200);
}

// inicializa
carregarCarrinho();
