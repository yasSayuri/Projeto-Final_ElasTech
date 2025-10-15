// ==================== DADOS/PRODUTOS ====================
const produtos = [
  {id:1, nome:"Computador Desktop Apple",preco:49.90,img:"./assets/computador-desktop-apple.jpg",categoria:"Computadores"},
  {id:2, nome:"Computador Desktop Intel Core",preco:45.90,img:"./assets/computador-desktop-intel-core.jpg",categoria:"Computadores"},
  {id:3, nome:"Computador HP",preco:39.90,img:"./assets/computador-hp.jpg",categoria:"Computadores"},
  {id:4, nome:"Computador Samsung",preco:42.90,img:"./assets/computador-samsung.jpg",categoria:"Computadores"},
  {id:5, nome:"Notebook Lenovo Slim",preco:52.90,img:"./assets/notebook-lenovo-slim.jpg",categoria:"Notebooks"},
  {id:6, nome:"Notebook Windows 10",preco:48.90,img:"./assets/notebook-windows-10.jpg",categoria:"Notebooks"},
  {id:7, nome:"iPad Air 5ª Geração",preco:29.90,img:"./assets/table4.jpg",categoria:"Tablets"},
  {id:8, nome:"Tablet iPad 9ª Geração",preco:59.90,img:"./assets/tablet5.jpg",categoria:"Tablets"},
  {id:9, nome:"Smartphone Pixel 7",preco:64.90,img:"./assets/cel5.jpg",categoria:"Smartphones"},
  {id:10, nome:"Smartphone iPhone",preco:79.90,img:"./assets/cel6.jpg",categoria:"Smartphones"},
  {id:11, nome:"Teclado Mecânico RGB",preco:34.90,img:"./assets/teclado2.jpg",categoria:"Periféricos"},
  {id:12, nome:"Headset Branco Sem Fio",preco:49.90,img:"./assets/headtset3.jpg",categoria:"Periféricos"},
  {id:13, nome:"Headset HyperX Preto",preco:54.90,img:"./assets/headset2.jpg",categoria:"Periféricos"},
  {id:14, nome:"Headset Gamer Redragon",preco:59.90,img:"./assets/headset-1.jpg",categoria:"Periféricos"},
  {id:15, nome:"iPhone 15 Roxo",preco:99.90,img:"./assets/cel1.jpg",categoria:"Smartphones"},
  {id:16, nome:"Motorola G86 5G",preco:89.90,img:"./assets/cel2.jpg",categoria:"Smartphones"},
  {id:17, nome:"Samsubg Galaxy S23",preco:79.90,img:"./assets/cel3.jpg",categoria:"Smartphones"},
  {id:18, nome:"iPhone azul",preco:69.90,img:"./assets/cel4.jpg",categoria:"Smartphones"},
  {id:19, nome:"Tablet Galaxy A9",preco:69.90,img:"./assets/tablet-1.jpg",categoria:"Tablets"},
  {id:20, nome:"Lenovo Tab P11",preco:49.90,img:"./assets/tablet2.jpg",categoria:"Tablets"},
  {id:21, nome:"Tablet Multilaser M9",preco:29.90,img:"./assets/tablet3.jpg",categoria:"Tablets"},
  {id:22, nome:"Cooler T-Dagger RGB", preco:39.90, img:"./assets/cooler1.jpg", categoria:"Componentes" },
  {id:23, nome:"Placa de Vídeo NVIDIA", preco:129.90, img:"./assets/placa1.jpg", categoria:"Componentes" },
  {id:24, nome:"SSD SanDisk 240GB", preco:79.90, img:"./assets/ssd1.jpg", categoria:"Componentes" },
  {id:25, nome:"SSD NVMe Kingston 500GB", preco:99.90, img:"./assets/ssd2.jpg", categoria:"Componentes" },
  {id:26, nome:"Mousepad Gamer RGB", preco:29.90, img:"./assets/mousepad1.jpg", categoria:"Acessórios" },
  {id:27, nome:"Mousepad Preto Minimalista", preco:19.90, img:"./assets/mousepad2.jpg", categoria:"Acessórios" },
  {id:28, nome:"Mousepad Estampa Roxa", preco:24.90, img:"./assets/mousepad3.jpg", categoria:"Acessórios" },
];

// ==================== CONFIG/API & HELPERS (mesmo do carrinho) ====================
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

async function syncPedidoBackend(statusOverride){
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const { subtotal, frete } = calcularTotais(carrinho);
  const status = statusOverride || "PENDENTE";
  const pedidoId = getPedidoId();

  if (carrinho.length === 0) {
    if (pedidoId) {
      try { await fetch(`${API}/${pedidoId}`, { method: "DELETE" }); }
      catch(e){ console.error("Erro ao deletar pedido:", e); }
      clearPedidoId();
    }
    return;
  }

  const body = { usuarioId: 1, status, subtotal, descontoTotal: 0, frete };

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

// ==================== RENDERIZAÇÃO DA LOJA ====================
const elLista = document.getElementById('produtos');
const links = document.querySelectorAll('.cat-link');
const iconeFavorito = '<span class="material-icons" style="color:#FFD700;">favorite</span>';
const iconeCarrinho = '<span class="material-icons add-cart">shopping_cart</span>';

function formatarPreco(v){return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}

function cardTemplate(p){
  return `
    <div class="produto" data-id="${p.id}">
      <img src="${p.img}" alt="${p.nome}">
      <p>${p.nome}</p>
      <p>${formatarPreco(p.preco)}</p>
      <div class="icon-card">
        ${iconeFavorito}
        ${iconeCarrinho}
      </div>
    </div>
  `;
}

function render(lista){
  elLista.innerHTML = lista.map(cardTemplate).join('');
  addClickListeners();
}

function filtrarPorCategoria(cat){
  if(!cat) return render(produtos);
  const lista = produtos.filter(p=>p.categoria===cat);
  render(lista);
}

links.forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    const cat = a.getAttribute('data-cat');
    filtrarPorCategoria(cat);
  });
});

// ==================== AÇÕES: ADD/REMOVE ====================
function addClickListeners() {
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', async e => {
      const produtoEl = e.target.closest('.produto');
      const id = parseInt(produtoEl.dataset.id);
      const produto = produtos.find(p => p.id === id);
      await adicionarAoCarrinho(produto);
    });
  });
}

async function adicionarAoCarrinho(produto) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const existente = carrinho.find(p => p.id === produto.id);
  if (existente) {
    existente.quantidade += 1;
  } else {
    carrinho.push({...produto, quantidade: 1});
  }
  localStorage.setItem('carrinho', JSON.stringify(carrinho));

  await syncPedidoBackend();   // cria/atualiza pedido
  renderMiniCart();
  mostrarToast(`${produto.nome} adicionado ao carrinho!`);
}

function removerDoCarrinho(id) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho = carrinho.filter(p => p.id !== id);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  syncPedidoBackend();         // atualiza/deleta pedido
  renderMiniCart();
  mostrarToast('Produto removido do carrinho!');
}

// ==================== MINI-CART (spoiler) ====================
const cartWrap   = document.getElementById('cartWrap');
const miniCart   = document.getElementById('miniCart');
const miniCartBody = document.getElementById('miniCartBody');
const miniTotalEl  = document.getElementById('miniTotal');

let hideTimer;

function renderMiniCart() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  if (carrinho.length === 0) {
    miniCartBody.innerHTML = `<p class="mini-empty">Seu carrinho está vazio</p>`;
    miniTotalEl.textContent = 'R$ 0,00';
    return;
  }

  let total = 0;
  miniCartBody.innerHTML = carrinho.map(p => {
    const linhaTotal = p.preco * p.quantidade;
    total += linhaTotal;
    return `
      <div class="mini-row" data-id="${p.id}">
        <div class="mini-thumb" style="background-image:url('${p.img}')"></div>
        <div class="mini-info">
          <div class="mini-name">${p.nome}</div>
          <div class="mini-attrs">${p.categoria}</div>
          <div class="mini-price">R$: ${linhaTotal.toFixed(2)}</div>
        </div>
        <span class="material-icons mini-delete" title="Remover do carrinho">delete</span>
      </div>
    `;
  }).join('');

  miniTotalEl.textContent = `R$ ${total.toFixed(2)}`;

  document.querySelectorAll('.mini-delete').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = parseInt(e.target.closest('.mini-row').dataset.id);
      removerDoCarrinho(id);
    });
  });
}

cartWrap?.addEventListener('mouseenter', ()=>{
  clearTimeout(hideTimer);
  cartWrap.classList.add('open');
  cartWrap.setAttribute('aria-expanded','true');
  renderMiniCart();
});
cartWrap?.addEventListener('mouseleave', ()=>{
  hideTimer = setTimeout(()=>{
    cartWrap.classList.remove('open');
    cartWrap.setAttribute('aria-expanded','false');
  }, 120);
});
// clique no ícone -> navega pro carrinho
cartWrap?.addEventListener('click', (e) => {
  const link = e.target.closest('.cart-link');
  if (link) {
    window.location.href = './carrinho.html';
    return;
  }
  const isOpen = cartWrap.classList.toggle('open');
  cartWrap.setAttribute('aria-expanded', String(isOpen));
  if (isOpen) renderMiniCart();
});

// ==================== Toast ====================
function mostrarToast(mensagem) {
  const antigo = document.querySelector('.toast');
  if (antigo) antigo.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = mensagem;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, 2200);
}

// inicializa a loja
render(produtos.filter(p=>p.categoria==="Computadores"));
renderMiniCart();
