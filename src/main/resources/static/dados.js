/* =========================
   USER / PERFIL / SAUDAÇÃO
   ========================= */
function getUserSafe(){ try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } }
const CURRENT_USER = getUserSafe();

function getFirstName(nome){
  if(!nome) return 'Visitante';
  const p = (nome || '').trim().split(/\s+/);
  return p[0] || 'Visitante';
}

function initGreeting(){
  const first = getFirstName(CURRENT_USER && CURRENT_USER.nome);
  const fn = document.getElementById('firstName');
  const mn = document.getElementById('miniName');
  if(fn) fn.textContent = first;
  if(mn) mn.textContent = first;
}

function initMiniProfile(){
  const profileWrap = document.getElementById('profileWrap');
  let t;
  if(!profileWrap) return;

  profileWrap.addEventListener('mouseenter', ()=>{
    clearTimeout(t);
    profileWrap.classList.add('open');
    profileWrap.setAttribute('aria-expanded','true');
  });
  profileWrap.addEventListener('mouseleave', ()=>{
    t = setTimeout(()=>{
      profileWrap.classList.remove('open');
      profileWrap.setAttribute('aria-expanded','false');
    },120);
  });
  profileWrap.addEventListener('click',(e)=>{
    const link = e.target.closest && e.target.closest('.profile-link');
    if(link){ window.location.href = './perfil.html'; return; }
    const isOpen = profileWrap.classList.toggle('open');
    profileWrap.setAttribute('aria-expanded', String(isOpen));
  });
  document.addEventListener('click',(e)=>{
    if(!profileWrap.contains(e.target)){
      profileWrap.classList.remove('open');
      profileWrap.setAttribute('aria-expanded','false');
    }
  });
}

function initLogout(){
  const btn = document.getElementById('logoutBtn');
  if(!btn) return;
  btn.addEventListener('click',()=>{
    localStorage.removeItem('user');
    localStorage.removeItem('carrinho');
    localStorage.removeItem('pedidoId');
    localStorage.removeItem('categorias_por_pedido');
    window.location.href = './index.html';
  });
}

/* =========================
   ENDPOINTS
   ========================= */
const API_PEDIDOS_BASE = 'http://localhost:8080/api/pedidos';
const API_USUARIOS_BASE = 'http://localhost:8080/api/usuarios';

const API_PEDIDOS_LISTAR      = `${API_PEDIDOS_BASE}`;
const API_PEDIDOS_POR_ID      = (id) => `${API_PEDIDOS_BASE}/${id}`;
const API_PEDIDOS_POR_USUARIO = (usuarioId) => `${API_PEDIDOS_BASE}/usuario/${usuarioId}`;
const API_USUARIO_POR_EMAIL   = (email) => `${API_USUARIOS_BASE}/email/${encodeURIComponent(email)}`;

/* =========================
   CHAMADAS DE API
   ========================= */
async function apiListarPedidos() {
  const r = await fetch(API_PEDIDOS_LISTAR);
  if(!r.ok) throw new Error('Falha ao listar pedidos');
  return r.json();
}

async function apiObterPedidoPorId(id) {
  const r = await fetch(API_PEDIDOS_POR_ID(id));
  if(r.status === 404) return null;
  if(!r.ok) throw new Error('Falha ao buscar pedido');
  return r.json();
}

async function apiObterUsuarioPorEmail(email) {
  const r = await fetch(API_USUARIO_POR_EMAIL(email));
  if(r.status === 404) return null;
  if(!r.ok) throw new Error('Falha ao buscar usuário');
  return r.json();
}

async function apiObterPedidosPorUsuario(usuarioId) {
  const r = await fetch(API_PEDIDOS_POR_USUARIO(usuarioId));
  if(!r.ok) throw new Error('Falha ao buscar pedidos do usuário');
  return r.json();
}

/* =========================
   FORMATADORES / HELPERS
   ========================= */
function formatarValor(v){
  const n = Number(v ?? 0);
  return n.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
}

function normalizar(s) {
  return String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .toLowerCase()
    .trim();
}

function extrairNomeUsuario(pedido) {
  // vem como nomeUsuario do DTO; fallback para pedido.usuario.nome se existir
  return (
    pedido?.nomeUsuario ??
    pedido?.usuario?.nome ??
    '-'
  );
}

function extrairProdutosStr(pedido){
  // Espera-se: pedido.produtos: [{ id, nome, quantidade, ... }]
  const itens = Array.isArray(pedido?.produtos) ? pedido.produtos : [];
  if (!itens.length) return '—';
  return itens.map(it => {
    const nome = it?.nome ?? 'Produto';
    const qtd  = Number(it?.quantidade ?? 1);
    return `${nome} (x${qtd})`;
  }).join(', ');
}

/* =========================
   RENDER
   ========================= */
function renderPedidos(pedidos) {
  const el = document.getElementById('lista-pedidos');
  if(!el) return;

  const arr = Array.isArray(pedidos) ? pedidos : (pedidos ? [pedidos] : []);
  if(arr.length === 0){
    el.innerHTML = `
      <div class="pedido-row">
        <div class="pedido-id">—</div>
        <div class="pedido-produtos">Nenhum pedido encontrado.</div>
        <div class="pedido-total">—</div>
        <div class="pedido-nome">—</div>
      </div>`;
    return;
  }

  el.innerHTML = arr.map(p => {
    const id     = p.id ?? '—';
    const prods  = extrairProdutosStr(p);           // << produtos após o ID
    const total  = formatarValor(p.total);
    const nome   = extrairNomeUsuario(p);

    return `
      <div class="pedido-row">
        <div class="pedido-id">#${id}</div>
        <div class="pedido-produtos">${prods}</div>
        <div class="pedido-total">${total}</div>
        <div class="pedido-nome">${nome}</div>
      </div>
    `;
  }).join('');
}

/* =========================
   BUSCA
   ========================= */
function ehEmail(valor){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor || '').trim());
}
function ehNumero(valor){
  return /^\d+$/.test(String(valor || '').trim());
}

async function aplicarBuscaPedidos(termo) {
  const v = (termo || '').trim();

  // vazio → lista tudo
  if (v === '') {
    const lista = await apiListarPedidos();
    renderPedidos(lista);
    return;
  }

  // ID numérico → busca por ID (já funcionando)
  if (ehNumero(v)) {
    const ped = await apiObterPedidoPorId(Number(v));
    renderPedidos(ped ? [ped] : []);
    return;
  }

  // e-mail → resolve usuário e lista pedidos dele (já funcionando)
  if (ehEmail(v)) {
    const usuario = await apiObterUsuarioPorEmail(v);
    if (!usuario) { renderPedidos([]); return; }
    const pedidosUser = await apiObterPedidosPorUsuario(usuario.id);
    renderPedidos(pedidosUser);
    return;
  }

  // NOME DO CLIENTE (parcial, sem acento, case-insensitive)
  const termoNorm = normalizar(v);
  const todos = await apiListarPedidos();
  const filtrados = (todos || []).filter(p => {
    const nome = extrairNomeUsuario(p);
    return normalizar(nome).includes(termoNorm);
  });
  renderPedidos(filtrados);
}

function initBuscaPedidos() {
  const form = document.getElementById('buscaPedidosForm');
  const input = document.getElementById('buscaPedidosInput');
  if(!form || !input) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await aplicarBuscaPedidos(input.value || '');
    } catch(err) {
      console.error(err);
      renderPedidos([]);
    }
  });

  input.addEventListener('input', async () => {
    if(input.value === '') {
      try {
        const lista = await apiListarPedidos();
        renderPedidos(lista);
      } catch(err) {
        console.error(err);
        renderPedidos([]);
      }
    }
  });
}

/* =========================
   BOOT
   ========================= */
window.addEventListener('load', async () => {
  initGreeting();
  initMiniProfile();
  initLogout();
  initBuscaPedidos();

  try {
    const lista = await apiListarPedidos();
    renderPedidos(lista);
  } catch (err) {
    console.error(err);
    renderPedidos([]);
  }
});
