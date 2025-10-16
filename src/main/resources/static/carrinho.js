function getUserSafe(){ try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } }
const CURRENT_USER = getUserSafe();
const USER_ID = CURRENT_USER?.id || null;
function k(name){ return USER_ID ? `${name}_${USER_ID}` : name; }

const API = "http://localhost:8080/api/pedidos";
const STATUS = { PENDENTE:'PENDENTE', PAGO:'PAGO', ENVIADO:'ENVIADO', ENTREGUE:'ENTREGUE', CANCELADO:'CANCELADO' };

function getPedidoId(){ return localStorage.getItem(k('pedidoId')); }
function setPedidoId(id){ localStorage.setItem(k('pedidoId'), String(id)); }
function clearPedidoId(){ localStorage.removeItem(k('pedidoId')); }

function loadCarrinho(){ return JSON.parse(localStorage.getItem(k('carrinho'))) || []; }
function saveCarrinho(c){ localStorage.setItem(k('carrinho'), JSON.stringify(c)); }

function round2(n){ return Number(n.toFixed(2)); }
function calcularTotais(carrinho){
  const subtotal = round2(carrinho.reduce((acc, p) => acc + (p.preco * p.quantidade), 0));
  const frete = subtotal >= 200 ? 0 : (subtotal > 0 ? 20 : 0);
  const total = round2(subtotal + frete);
  return { subtotal, frete, total };
}

async function syncPedidoBackend(statusOverride){
  const carrinho = loadCarrinho();
  const { subtotal, frete } = calcularTotais(carrinho);
  const status = statusOverride || STATUS.PENDENTE;
  const pedidoId = getPedidoId();
  if (!USER_ID) return;
  if (carrinho.length === 0) {
    if (pedidoId) { try { await fetch(`${API}/${pedidoId}`, { method: "DELETE" }); } catch(e){} clearPedidoId(); }
    return;
  }
  const body = { usuarioId: USER_ID, status, subtotal, descontoTotal: 0, frete };
  try {
    if (!pedidoId) {
      const r = await fetch(API, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(body) });
      const data = await r.json();
      if (data && data.id) setPedidoId(data.id);
    } else {
      await fetch(`${API}/${pedidoId}`, { method: "PUT", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ ...body, id: Number(pedidoId) }) });
    }
  } catch(err){}
}

function salvarCategoriasSnapshot(pid, carrinho){
  const key = k('categorias_por_pedido');
  const store = JSON.parse(localStorage.getItem(key) || '{}');

  const set = new Set(carrinho.map(i => String(i.categoria)));
  const categorias = Array.from(set).join(', ');

  const thumb = (carrinho.find(i => i.img)?.img) || './assets/placeholder.png';

  store[String(pid)] = { categorias, thumb };
  localStorage.setItem(key, JSON.stringify(store));
}


async function finalizarPedidoComCarrinho(carrinho){
  const { subtotal, frete, total } = calcularTotais(carrinho);
  if (!USER_ID) throw new Error("LOGIN");
  if (!carrinho.length) throw new Error("VAZIO");

  const body = { usuarioId: USER_ID, status: STATUS.PENDENTE, subtotal, descontoTotal: 0, frete, total };

  const pedidoId = getPedidoId();
  if (pedidoId) {
    const rPut = await fetch(`${API}/${pedidoId}`, {
      method: 'PUT', headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ ...body, id: Number(pedidoId) })
    });
    if (rPut.ok) { salvarCategoriasSnapshot(pedidoId, carrinho); return; }
    if (rPut.status !== 404) throw new Error('PUT_FAIL');
    clearPedidoId();
  }

  const rPost = await fetch(API, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  if (!rPost.ok) throw new Error('POST_FAIL');
  const data = await rPost.json().catch(()=>null);
  if (data?.id) { setPedidoId(data.id); salvarCategoriasSnapshot(data.id, carrinho); }
}

const corpoCarrinho = document.querySelector('.cart-body');

function carregarCarrinho() {
  const carrinho = loadCarrinho();
  if (carrinho.length === 0) {
    corpoCarrinho.innerHTML = `<p style="padding:20px; text-align:center;">Seu carrinho está vazio!</p>`;
    atualizarTotais();
    return;
  }
  const produtosHTML = carrinho.map(prod => `
    <div class="cart-row" data-id="${prod.id}">
      <div class="prod">
        <div class="thumb" style="background-image:url('${prod.img}');background-size:cover;background-position:center;"></div>
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
  let carrinho = loadCarrinho();
  const produto = carrinho.find(p => p.id === id);
  if (!produto) return;
  produto.quantidade += delta;
  if (produto.quantidade <= 0) {
    carrinho = carrinho.filter(p => p.id !== id);
  }
  saveCarrinho(carrinho);
  carregarCarrinho();
  syncPedidoBackend();
}

function removerProduto(id) {
  let carrinho = loadCarrinho();
  carrinho = carrinho.filter(p => p.id !== id);
  saveCarrinho(carrinho);
  carregarCarrinho();
  syncPedidoBackend();
  mostrarToast("Produto removido do carrinho!");
}

function atualizarTotais() {
  const carrinho = loadCarrinho();
  const els = {
    subtotal: document.querySelector(".totals .line:nth-child(1) span:last-child"),
    frete:    document.querySelector(".totals .line:nth-child(3) span:last-child"),
    total:    document.querySelector(".totals .line.total span:last-child")
  };
  if (!els.subtotal || !els.frete || !els.total) return;
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

document.getElementById('btnFazerPedido')?.addEventListener('click', async ()=>{
  const carrinhoAtual = loadCarrinho();
  if (!carrinhoAtual.length) { mostrarToast("Seu carrinho está vazio!"); return; }
  if (!USER_ID) { mostrarToast("Faça login para finalizar."); return; }
  try {
    await finalizarPedidoComCarrinho(carrinhoAtual);
    saveCarrinho([]);
    clearPedidoId();
    carregarCarrinho();
    atualizarTotais();
    mostrarToast("Pedido enviado! Status: PENDENTE");
  } catch(e){
    mostrarToast("Não foi possível finalizar o pedido.");
  }
});

function mostrarToast(msg){
  let t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(()=> t.classList.add('show'));
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(), 250); }, 2200);
}

carregarCarrinho();
