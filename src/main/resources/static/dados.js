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
   FORMATADORES
   ========================= */
function formatarValor(v){
  if(v == null) return 'R$ 0,00';
  return `R$ ${parseFloat(v).toFixed(2).replace('.', ',')}`;
}

function extrairNomeUsuario(pedido) {
  return (
    pedido?.nomeUsuario ??
    pedido?.usuario?.nome ??
    '-'
  );
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
        <div class="pedido-total">Nenhum pedido encontrado.</div>
        <div class="pedido-nome">—</div>
      </div>`;
    return;
  }

  el.innerHTML = arr.map(p => {
    const id = p.id ?? '—';
    const total = formatarValor(p.total);
    const nomeUsuario = extrairNomeUsuario(p);

    return `
      <div class="pedido-row">
        <div class="pedido-id">#${id}</div>
        <div class="pedido-total">${total}</div>
        <div class="pedido-nome">${nomeUsuario}</div>
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

  if(v === '') {
    const lista = await apiListarPedidos();
    renderPedidos(lista);
    return;
  }

  if(ehNumero(v)) {
    const ped = await apiObterPedidoPorId(Number(v));
    renderPedidos(ped ? [ped] : []);
    return;
  }

  if(ehEmail(v)) {
    const usuario = await apiObterUsuarioPorEmail(v);
    if(!usuario) { renderPedidos([]); return; }
    const pedidosUser = await apiObterPedidosPorUsuario(usuario.id);
    renderPedidos(pedidosUser);
    return;
  }

  const lista = await apiListarPedidos();
  renderPedidos(lista);
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
