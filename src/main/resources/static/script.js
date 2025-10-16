// ====== USER + KEYS ======
function getUserSafe(){ try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } }
const CURRENT_USER = getUserSafe();
const USER_ID = CURRENT_USER?.id || null;
function k(name){ return USER_ID ? `${name}_${USER_ID}` : name; }

// ====== API ENDPOINTS ======
const API_PEDIDOS = "/api/pedidos";

const API_PRODUTOS_BASE  = "/api/produtos"; 
const API_PRODUTOS_BUSCA = (nome) => `/api/produtos/produtoNome/${encodeURIComponent(nome)}`; // buscarPorNome
const API_PRODUTOS_ASC   = "/api/produtos/precoAsc"; 
const API_PRODUTOS_DESC  = "/api/produtos/precoDesc";

// ====== IMG MAP (fallback se não vier da API) ====
const IMG_BY_ID = { 1:"./assets/computador-desktop-apple.jpg",2:"./assets/computador-desktop-intel-core.jpg",
  3:"./assets/computador-hp.jpg",4:"./assets/computador-samsung.jpg",5:"./assets/notebook-lenovo-slim.jpg",
  6:"./assets/notebook-windows-10.jpg",7:"./assets/table4.jpg",8:"./assets/tablet5.jpg",9:"./assets/cel5.jpg",
  10:"./assets/cel6.jpg",11:"./assets/teclado2.jpg",12:"./assets/headtset3.jpg",13:"./assets/headset2.jpg",
  14:"./assets/headset-1.jpg",15:"./assets/cel1.jpg",16:"./assets/cel2.jpg",17:"./assets/cel3.jpg",
  18:"./assets/cel4.jpg",19:"./assets/tablet-1.jpg",20:"./assets/tablet2.jpg",21:"./assets/tablet3.jpg",
  22:"./assets/cooler1.jpg",23:"./assets/placa1.jpg",24:"./assets/ssd1.jpg",25:"./assets/ssd2.jpg",
  26:"./assets/mousepad1.jpg",27:"./assets/mousepad2.jpg",28:"./assets/mousepad3.jpg" };

// ====== CARRINHO helpers ======
function getPedidoId(){ return localStorage.getItem(k('pedidoId')); }
function setPedidoId(id){ localStorage.setItem(k('pedidoId'), String(id)); }
function clearPedidoId(){ localStorage.removeItem(k('pedidoId')); }
function loadCarrinho(){ return JSON.parse(localStorage.getItem(k('carrinho'))) || []; }
function saveCarrinho(c){ localStorage.setItem(k('carrinho'), JSON.stringify(c)); }
function calcularTotais(carrinho){
  const round2 = n => Number(n.toFixed(2));
  const subtotal = round2(carrinho.reduce((acc, p) => acc + (p.preco * p.quantidade), 0));
  const frete = subtotal >= 200 ? 0 : (subtotal > 0 ? 20 : 0);
  const total = round2(subtotal + frete);
  return { subtotal, frete, total };
}
async function syncPedidoBackend(statusOverride){
  const carrinho = loadCarrinho();
  const { subtotal, frete } = calcularTotais(carrinho);
  const status = statusOverride || "PENDENTE";
  const pedidoId = getPedidoId();
  if (!USER_ID) return;
  if (carrinho.length === 0) {
    if (pedidoId) { try { await fetch(`${API_PEDIDOS}/${pedidoId}`, { method: "DELETE" }); } catch(e){}; clearPedidoId(); }
    return;
  }
  const body = { usuarioId: USER_ID, status, subtotal, descontoTotal: 0, frete };
  try {
    if (!pedidoId) {
      const r = await fetch(API_PEDIDOS,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      const data = await r.json().catch(()=>null);
      if (data && data.id) setPedidoId(data.id);
    } else {
      await fetch(`${API_PEDIDOS}/${pedidoId}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({ ...body, id: Number(pedidoId) })});
    }
  } catch(e){}
}

// ====== FAVORITOS ======
function loadFavoritos(){ return JSON.parse(localStorage.getItem(k('favoritos')) || '[]'); }
function saveFavoritos(favs){ localStorage.setItem(k('favoritos'), JSON.stringify(favs)); }
function isFav(id){ return loadFavoritos().some(f => Number(f.id) === Number(id)); }
function toggleFavorito(produto){
  let favs = loadFavoritos();
  const idx = favs.findIndex(f => Number(f.id) === Number(produto.id));
  if (idx >= 0) {
    favs.splice(idx,1); saveFavoritos(favs); mostrarToast('Removido dos favoritos!'); return false;
  } else {
    const novo = { id: produto.id, nome: produto.nome, preco: produto.preco, img: produto.img, categoria: produto.categoria };
    favs.push(novo); saveFavoritos(favs); mostrarToast('Adicionado aos favoritos!'); return true;
  }
}

// ====== PRODUTOS + STATE ======
let produtos = [];           // cache local (lista completa)
let listaAtual = [];         // última lista renderizada
const state = { mode: 'all', // all | search | category
                query: '',   // termo de busca atual
                category: '' // categoria atual
              };

function imgKey(id){ return `img_override_${id}`; }
function normalizeCategoria(c) {
  const map = {'COMPUTADORES':'Computadores','NOTEBOOKS':'Notebooks','TABLETS':'Tablets','SMARTPHONES':'Smartphones',
               'ACESSÓRIOS':'Acessórios','PERIFÉRICOS':'Periféricos','COMPONENTES':'Componentes','OUTROS':'Outros'};
  return map[c] || c || 'Outros';
}
function mapProdutoAPI(p){
  const id = Number(p.id);
  const override = localStorage.getItem(imgKey(id));
  return {
    id,
    nome: p.nome,
    preco: Number(p.preco),
    img: override || p.imagemUrl || IMG_BY_ID[id] || './assets/placeholder.png',
    categoria: normalizeCategoria(p.categoriaProduto),
    _raw: p
  };
}

// ---- chamadas ao backend (com fallback) ----
async function fetchTodos(){
  try{
    const r = await fetch(API_PRODUTOS_BASE);
    if(!r.ok) throw 0;
    const lista = await r.json();
    return lista.map(mapProdutoAPI);
  }catch{ return null; }
}

async function fetchBuscaNome(nome){
  try{
    const r = await fetch(API_PRODUTOS_BUSCA(nome)); // usa service buscarPorNome
    if(!r.ok) throw 0;
    const lista = await r.json();
    return lista.map(mapProdutoAPI);
  }catch{ return null; }
}

async function fetchOrdenado(dir){
  const url = dir === 'asc' ? API_PRODUTOS_ASC : API_PRODUTOS_DESC; // usa service ordenarPorOrdemAscendente/Descente
  try{
    const r = await fetch(url);
    if(!r.ok) throw 0;
    const lista = await r.json();
    return lista.map(mapProdutoAPI);
  }catch{ return null; }
}

// ====== CARREGAR (primeira carga) ======
async function carregarProdutos() {
  const server = await fetchTodos();
  if (server) { produtos = server; return; }
  // fallback local pra não quebrar a vitrine
  produtos = [
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
    {id:28, nome:"Mousepad Estampa Roxa", preco:24.90, img:"./assets/mousepad3.jpg", categoria:"Acessórios" }
  ];
}

// ====== RENDER ======
const elLista  = document.getElementById('produtos');
const banner   = document.querySelector('.banner-pagbank');
function formatarPreco(v){ return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }
const iconeFavorito = id => {
  const active = isFav(id);
  return `<span class="material-icons fav-toggle${active?' is-fav':''}" aria-pressed="${active}" title="${active?'Remover dos favoritos':'Adicionar aos favoritos'}">favorite</span>`;
};
const iconeCarrinho = '<span class="material-icons add-cart">shopping_cart</span>';

function cardTemplate(p){
  return `
    <div class="produto" data-id="${p.id}">
      <img src="${p.img}" alt="${p.nome}">
      <p>${p.nome}</p>
      <p>${formatarPreco(p.preco)}</p>
      <div class="icon-card">
        ${iconeFavorito(p.id)}
        ${iconeCarrinho}
      </div>
    </div>`;
}

function applySort(list){
  // pega valor do select "fake" (custom) ou do nativo
  const sel = document.getElementById('sortSelect');
  let value = sel?.value || document.querySelector('.custom-select .options li.active')?.dataset.value || 'relevancia';
  const arr = [...list];
  if (value === 'asc')  arr.sort((a,b)=>a.preco-b.preco);
  if (value === 'desc') arr.sort((a,b)=>b.preco-a.preco);
  return arr;
}

function render(lista){
  if (!elLista) return;
  listaAtual = Array.isArray(lista) ? lista : [];
  const ordenada = applySort(listaAtual);
  elLista.innerHTML = ordenada.map(cardTemplate).join('');
  addClickListeners();
}

// ====== FILTROS POR CATEGORIA (client) ======
function filtrarPorCategoria(cat){
  state.mode = cat ? 'category' : 'all';
  state.category = cat || '';
  if(!cat){ if (banner) banner.style.display='block'; render(produtos); return; }
  if (banner) banner.style.display='block'; // com categoria, mantemos banner
  const lista = produtos.filter(p=>p.categoria===cat);
  render(lista);
}
document.querySelectorAll('.cat-link').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    filtrarPorCategoria(a.getAttribute('data-cat'));
  });
});

// ====== BUSCA (server first, fallback client) ======
const searchForm  = document.querySelector('form.search');
const searchInput = document.getElementById('search-input');

function resetHomeView() {
  state.mode = 'all';
  state.query = '';
  if (banner) banner.style.display = 'block';

  const principais = produtos.filter(p => p.categoria === 'Computadores');
  render(principais.length ? principais : produtos);
}


searchForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const q = (searchInput?.value || '').trim();
  if (!q){ resetHomeView(); return; }

  // tenta backend
  const server = await fetchBuscaNome(q);
  let lista = server ?? produtos.filter(p => p.nome.toLowerCase().includes(q.toLowerCase()));
  state.mode='search'; state.query=q;
  if (banner) banner.style.display = 'none';
  render(lista);
});

// limpar ao apagar/ESC/ícone X
function handleLiveSearchReset() {
  const val = (searchInput?.value || '').trim();
  if (val === '') resetHomeView();
}
searchInput?.addEventListener('search', handleLiveSearchReset);
searchInput?.addEventListener('input', handleLiveSearchReset);
searchInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { searchInput.value = ''; resetHomeView(); }
});

function getSortDir(){
  const native = document.getElementById('sortSelect');
  if (native && native.value) return native.value; 
  const active = document.querySelector('#customSelect .options li.active');
  return active?.dataset.value || 'relevancia';
}

// ====== SORT ======
async function handleSortChange(){
  const dir = getSortDir(); 

  if (state.mode === 'search') {
    render(listaAtual); 
    return;
  }

  if (state.mode === 'category' && state.category) {
    const listaCat = produtos.filter(p => p.categoria === state.category);
    const ordenada = [...listaCat];
    if (dir === 'asc')  ordenada.sort((a,b)=>a.preco-b.preco);
    if (dir === 'desc') ordenada.sort((a,b)=>b.preco-a.preco);
    render(ordenada);
    return;
  }

  if (state.mode === 'all' && (dir === 'asc' || dir === 'desc')) {
    const server = await fetchOrdenado(dir);
    if (server) {
      produtos = server;
      if (banner) banner.style.display = 'block';
      const principais = produtos.filter(p => p.categoria === 'Computadores');
      render(principais.length ? principais : produtos);
      return;
    }
  }

  render(listaAtual);
}


(function wireNativeSort(){
  const sel = document.getElementById('sortSelect');
  if (sel) sel.addEventListener('change', handleSortChange);
})();


// ====== CUSTOM SELECT FOFO (sincroniza com #sortSelect) ======
(function initCustomSelect(){
  const customSelect = document.getElementById('customSelect');
  if (!customSelect) return;
  const selected = customSelect.querySelector('.selected');
  const options  = customSelect.querySelectorAll('.options li');

  selected.addEventListener('click', () => customSelect.classList.toggle('open'));

  options.forEach(opt => {
    opt.addEventListener('click', async () => {
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      selected.textContent = opt.textContent;
      customSelect.classList.remove('open');

      const fake = document.getElementById('sortSelect');
      if (fake) fake.value = opt.dataset.value;

      await handleSortChange();
    });
  });


  document.addEventListener('click', e => {
    if (!customSelect.contains(e.target)) customSelect.classList.remove('open');
  });
})();

// ====== AÇÕES CARRINHO + FAVORITOS ======
function addClickListeners() {
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', async e => {
      const produtoEl = e.target.closest('.produto');
      const id = parseInt(produtoEl.dataset.id, 10);
      const produto = (listaAtual.find(p=>p.id===id) || produtos.find(p=>p.id===id));
      if (!produto) return;
      await adicionarAoCarrinho(produto);
    });
  });

  document.querySelectorAll('.fav-toggle').forEach(btn => {
    btn.addEventListener('click', e => {
      const produtoEl = e.target.closest('.produto'); if (!produtoEl) return;
      const id = parseInt(produtoEl.dataset.id, 10);
      const produto = (listaAtual.find(p=>p.id===id) || produtos.find(p=>p.id===id));
      if (!produto) return;
      const nowFav = toggleFavorito(produto);
      e.target.classList.toggle('is-fav', nowFav);
      e.target.setAttribute('aria-pressed', String(nowFav));
      e.target.title = nowFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
    });
  });
}

// ====== LOGOUT/PROFILE/SAUDAÇÃO ======
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user"); localStorage.removeItem("carrinho");
      localStorage.removeItem("pedidoId"); localStorage.removeItem("categorias_por_pedido");
      window.location.href = "./index.html";
    });
  }
});
const profileWrap = document.getElementById('profileWrap'); let profileHideTimer;
profileWrap?.addEventListener('mouseenter', () => { clearTimeout(profileHideTimer); profileWrap.classList.add('open'); profileWrap.setAttribute('aria-expanded', 'true'); });
profileWrap?.addEventListener('mouseleave', () => { profileHideTimer = setTimeout(() => { profileWrap.classList.remove('open'); profileWrap.setAttribute('aria-expanded', 'false'); }, 120); });
profileWrap?.addEventListener('click', (e) => { const link = e.target.closest('.profile-link'); if (link) { window.location.href = './perfil.html'; return; } const isOpen = profileWrap.classList.toggle('open'); profileWrap.setAttribute('aria-expanded', String(isOpen)); });
document.addEventListener('click', (e)=>{ if (!profileWrap) return; if (!profileWrap.contains(e.target)) { profileWrap.classList.remove('open'); profileWrap.setAttribute('aria-expanded','false'); }});
function getFirstName(nome) { if (!nome) return 'Visitante'; const p = nome.trim().split(/\s+/); return p[0] || 'Visitante'; }
(function initGreeting(){ const u = CURRENT_USER; const first = getFirstName(u?.nome); const fnEl = document.getElementById('firstName'); const miniName = document.getElementById('miniName'); if (fnEl) fnEl.textContent = first; if (miniName) miniName.textContent = first; })();

// ====== MINI-CART ======
const cartWrap     = document.getElementById('cartWrap');
const miniCartBody = document.getElementById('miniCartBody');
const miniTotalEl  = document.getElementById('miniTotal');
let hideTimer;
function renderMiniCart() {
  if (!miniCartBody || !miniTotalEl) return;
  const carrinho = loadCarrinho();
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
      </div>`;
  }).join('');
  miniTotalEl.textContent = `R$ ${total.toFixed(2)}`;
  document.querySelectorAll('.mini-delete').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = parseInt(e.target.closest('.mini-row').dataset.id, 10);
      removerDoCarrinho(id);
    });
  });
}
cartWrap?.addEventListener('mouseenter', ()=>{ clearTimeout(hideTimer); cartWrap.classList.add('open'); cartWrap.setAttribute('aria-expanded','true'); renderMiniCart(); });
cartWrap?.addEventListener('mouseleave', ()=>{ hideTimer = setTimeout(()=>{ cartWrap.classList.remove('open'); cartWrap.setAttribute('aria-expanded','false'); }, 120); });
cartWrap?.addEventListener('click', (e) => { const link = e.target.closest('.cart-link'); if (link) { window.location.href = './carrinho.html'; return; } const isOpen = cartWrap.classList.toggle('open'); cartWrap.setAttribute('aria-expanded', String(isOpen)); if (isOpen) renderMiniCart(); });

// ====== CARRINHO ======
async function adicionarAoCarrinho(produto) {
  let carrinho = loadCarrinho();
  const existente = carrinho.find(p => p.id === produto.id);
  if (existente) existente.quantidade += 1; else carrinho.push({...produto, quantidade: 1});
  saveCarrinho(carrinho);
  await syncPedidoBackend();
  renderMiniCart();
  mostrarToast(`${produto.nome} adicionado ao carrinho!`);
}
function removerDoCarrinho(id) {
  let carrinho = loadCarrinho();
  carrinho = carrinho.filter(p => p.id !== id);
  saveCarrinho(carrinho);
  syncPedidoBackend();
  renderMiniCart();
  mostrarToast('Produto removido do carrinho!');
}

// ====== TOAST ======
function garantirEstilosToast(){
  if(document.querySelector('style[data-toast]')) return;
  const s=document.createElement('style'); s.setAttribute('data-toast','');
  s.textContent=".toast{position:fixed;top:10%;left:50%;transform:translate(-50%,-50%);background:#FFD166;color:#fff;padding:14px 28px;border-radius:12px;font-weight:700;box-shadow:0 4px 15px rgba(0,0,0,.25);opacity:0;transition:all .3s ease;z-index:2000}.toast.show{opacity:1;transform:translate(-50%,-50%) scale(1.05)}";
  document.head.appendChild(s);
}
function mostrarToast(mensagem) {
  garantirEstilosToast();
  const antigo = document.querySelector('.toast'); if (antigo) antigo.remove();
  const toast = document.createElement('div'); toast.className = 'toast'; toast.textContent = mensagem;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 250); }, 2200);
}

// ====== BOOT ======
(async function bootstrapLoja(){
  await carregarProdutos();
  const listaInicial = produtos.filter(p => p.categoria === "Computadores");
  state.mode='all'; state.query=''; state.category='';
  render(listaInicial.length ? listaInicial : produtos);
  renderMiniCart();
})();
