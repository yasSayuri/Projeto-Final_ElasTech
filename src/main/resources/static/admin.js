/* =========================
   USER / PERFIL / SAUDAÇÃO
   ========================= */
function getUserSafe() {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
}
const CURRENT_USER = getUserSafe();

function getFirstName(nome) {
  if (!nome) return 'Visitante';
  const p = nome.trim().split(/\s+/);
  return p[0] || 'Visitante';
}

function initGreeting() {
  const first = getFirstName(CURRENT_USER?.nome);
  const fnEl = document.getElementById('firstName');
  const miniName = document.getElementById('miniName');
  if (fnEl) fnEl.textContent = first;
  if (miniName) miniName.textContent = first;
}

function initMiniProfile() {
  const profileWrap = document.getElementById('profileWrap');
  let t;
  if (!profileWrap) return;

  profileWrap.addEventListener('mouseenter', () => {
    clearTimeout(t);
    profileWrap.classList.add('open');
    profileWrap.setAttribute('aria-expanded', 'true');
  });

  profileWrap.addEventListener('mouseleave', () => {
    t = setTimeout(() => {
      profileWrap.classList.remove('open');
      profileWrap.setAttribute('aria-expanded', 'false');
    }, 120);
  });

  profileWrap.addEventListener('click', (e) => {
    const link = e.target.closest('.profile-link');
    if (link) { window.location.href = './perfil.html'; return; }
    const isOpen = profileWrap.classList.toggle('open');
    profileWrap.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (e) => {
    if (!profileWrap.contains(e.target)) {
      profileWrap.classList.remove('open');
      profileWrap.setAttribute('aria-expanded', 'false');
    }
  });
}

function initLogout() {
  const btn = document.getElementById('logoutBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    localStorage.removeItem('user');
    localStorage.removeItem('carrinho');
    localStorage.removeItem('pedidoId');
    localStorage.removeItem('categorias_por_pedido');
    window.location.href = './index.html';
  });
}

/* =========================
   ENDPOINTS DO BACKEND
   ========================= */
const API_BASE = 'http://localhost:8080/api/produtos';
const API_LISTAR = `${API_BASE}`;
const API_BUSCA_NOME = (nome) => `${API_BASE}/produtoNome/${encodeURIComponent(nome)}`;
const API_GET_ID = (id) => `${API_BASE}/${id}`;
const API_ATUALIZAR = (id) => `${API_BASE}/atualizar/${id}`;
const API_DELETAR = (id) => `${API_BASE}/${id}`;

/* =========================
   IMAGENS / FALLBACKS
   ========================= */
const IMG_BY_ID = {
  1:"./assets/computador-desktop-apple.jpg",
  2:"./assets/computador-desktop-intel-core.jpg",
  3:"./assets/computador-hp.jpg",
  4:"./assets/computador-samsung.jpg",
  5:"./assets/notebook-lenovo-slim.jpg",
  6:"./assets/notebook-windows-10.jpg",
  7:"./assets/table4.jpg",
  8:"./assets/tablet5.jpg",
  9:"./assets/cel5.jpg",
  10:"./assets/cel6.jpg",
  11:"./assets/teclado2.jpg",
  12:"./assets/headtset3.jpg",
  13:"./assets/headset2.jpg",
  14:"./assets/headset-1.jpg",
  15:"./assets/cel1.jpg",
  16:"./assets/cel2.jpg",
  17:"./assets/cel3.jpg",
  18:"./assets/cel4.jpg",
  19:"./assets/tablet-1.jpg",
  20:"./assets/tablet2.jpg",
  21:"./assets/tablet3.jpg",
  22:"./assets/cooler1.jpg",
  23:"./assets/placa1.jpg",
  24:"./assets/ssd1.jpg",
  25:"./assets/ssd2.jpg",
  26:"./assets/mousepad1.jpg",
  27:"./assets/mousepad2.jpg",
  28:"./assets/mousepad3.jpg"
};

const IMG_BY_CAT = {
  'SMARTPHONES': "./assets/cel5.jpg",
  'TABLETS': "./assets/tablet2.jpg",
  'NOTEBOOKS': "./assets/notebook-windows-10.jpg",
  'COMPUTADORES': "./assets/computador-desktop-intel-core.jpg",
  'ACESSÓRIOS': "./assets/mousepad2.jpg",
  'PERIFÉRICOS': "./assets/teclado2.jpg",
  'COMPONENTES': "./assets/placa1.jpg",
  'OUTROS': "./assets/placeholder.png"
};

function imgKey(id){ return `img_override_${id}`; }
function getOverrideImage(id){
  try { return localStorage.getItem(imgKey(id)) || null; } catch { return null; }
}

function pickImage(p) {
  const id = Number(p.id);
  const byUser = getOverrideImage(id);               // 1) override salvo no cadastro (base64)
  if (byUser) return byUser;
  if (p.imagemUrl) return p.imagemUrl;               // 2) caminho vindo do backend
  if (IMG_BY_ID[id]) return IMG_BY_ID[id];           // 3) catálogo por id
  const cat = String(p.categoriaProduto || 'OUTROS').toUpperCase();
  return IMG_BY_CAT[cat] || "./assets/placeholder.png"; // 4) fallback por categoria
}

/* =========================
   STATUS E BADGE
   ========================= */
function statusFrom(q) {
  if (q === 0) return 'ESGOTADO';
  if (q <= 3) return 'ACABANDO';
  return 'EM_ESTOQUE';
}

function badgeHtml(st) {
  if (st === 'EM_ESTOQUE') return '<span class="badge ok">Em estoque</span>';
  if (st === 'ACABANDO') return '<span class="badge warn">Acabando</span>';
  return '<span class="badge danger">Esgotado</span>';
}

/* =========================
   HELPERS DE FORMATAÇÃO
   ========================= */
function fmtBRL(v){
  try { return Number(v).toLocaleString('pt-BR',{style:'currency', currency:'BRL'}); }
  catch { return `R$ ${Number(v||0).toFixed(2)}`; }
}

/* =========================
   CHAMADAS DE API
   ========================= */
async function apiListarTodos() {
  const r = await fetch(API_LISTAR);
  if (!r.ok) throw new Error('Falha ao listar produtos');
  return r.json();
}

async function apiBuscarPorNome(nome) {
  const r = await fetch(API_BUSCA_NOME(nome));
  if (!r.ok) throw new Error('Falha na busca');
  return r.json();
}

async function apiGetPorId(id) {
  const r = await fetch(API_GET_ID(id));
  if (!r.ok) throw new Error('Produto não encontrado');
  return r.json();
}

/* Monta ProdutoRequest a partir do response do backend */
function toProdutoRequestFromResponse(resp, overrides) {
  const base = { ...(resp || {}) };
  const req = {
    nome: base.nome,
    descricao: base.descricao,
    preco: base.preco,
    categoriaProduto: base.categoriaProduto,
    quantidade: (base.quantidade ?? 0)
  };
  return { ...req, ...(overrides || {}) };
}

async function apiAtualizarProduto(id, produtoRequest) {
  const r = await fetch(API_ATUALIZAR(id), {
    method: 'PUT',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(produtoRequest)
  });
  if (!r.ok) throw new Error('Falha ao atualizar produto');
  return r.json();
}

async function apiDeletarProduto(id) {
  const r = await fetch(API_DELETAR(id), { method: 'DELETE' });
  if (!r.ok && r.status !== 204) throw new Error('Falha ao deletar produto');
}

/* =========================
   MODAL DE EXCLUSÃO (Estoque)
   ========================= */
let produtoParaExcluirId = null;
let produtoParaExcluirBtn = null;

function abrirModalExcluirProduto(nome) {
  const overlay = document.getElementById('modalExcluirProduto');
  const msg = document.getElementById('textoModalProduto');
  if (msg) {
    msg.textContent = `Tem certeza que deseja excluir "${nome}" do estoque? Esta ação é irreversível.`;
  }
  overlay?.classList.add('show');
}

function fecharModalExcluirProduto() {
  const overlay = document.getElementById('modalExcluirProduto');
  overlay?.classList.remove('show');
  produtoParaExcluirId = null;
  if (produtoParaExcluirBtn) {
    produtoParaExcluirBtn.removeAttribute('aria-disabled');
    produtoParaExcluirBtn = null;
  }
}

/* =========================
   RENDER DA LISTA
   ========================= */
function renderLista(lista) {
  const el = document.getElementById('lista-produtos');
  if (!el) return;

  el.innerHTML = (lista || []).map(p => {
    const id   = Number(p.id);
    const img  = pickImage(p);
    const cat  = p.categoriaProduto || '-';
    const qtd  = Number(p.quantidade ?? 0);
    const st   = (p.status && String(p.status)) || statusFrom(qtd);
    const preco= Number(p.preco);

    return `
      <div class="estoque-row" data-id="${id}">
        <div class="prod-info">
          <div class="prod-thumb" style="background-image:url('${img}')"></div>
          <div class="prod-nomes">
            <div class="prod-nome">${p.nome}</div>
            <div class="prod-subcat">${cat}</div>
          </div>
        </div>
        <div>${cat}</div>
        <div class="preco">${fmtBRL(preco)}</div>
        <div>
          <div class="qty">
            <button class="menos" aria-label="diminuir">−</button>
            <span class="qtd">${qtd}</span>
            <button class="mais" aria-label="aumentar">+</button>
          </div>
        </div>
        <div class="col-status">
          <div class="row-actions">
            ${badgeHtml(st)}
            <span
              class="material-icons icon-delete"
              title="Excluir produto"
              role="button"
              aria-label="Excluir produto">
              delete
            </span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  wireQuantidadeHandlers();
  wireDeleteHandlers();
}

/* =========================
   HANDLERS + / − (QUANTIDADE)
   ========================= */
function wireQuantidadeHandlers() {
  const container = document.getElementById('lista-produtos');
  if (!container) return;

  container.querySelectorAll('.menos').forEach(btn => {
    btn.addEventListener('click', async e => {
      const row = e.target.closest('.estoque-row');
      if (!row) return;
      const id = Number(row.dataset.id);
      const qtdEl = row.querySelector('.qtd');
      const statusEl = row.querySelector('.col-status');

      let q = Math.max(0, Number(qtdEl.textContent) - 1);
      qtdEl.textContent = String(q);
      statusEl.innerHTML = badgeHtml(statusFrom(q));

      try {
        const atual = await apiGetPorId(id);
        const req = toProdutoRequestFromResponse(atual, {
          quantidade: q,
          status: statusFrom(q)
        });
        await apiAtualizarProduto(id, req);
      } catch (err) {
        console.error(err);
      }
    });
  });

  container.querySelectorAll('.mais').forEach(btn => {
    btn.addEventListener('click', async e => {
      const row = e.target.closest('.estoque-row');
      if (!row) return;
      const id = Number(row.dataset.id);
      const qtdEl = row.querySelector('.qtd');
      const statusEl = row.querySelector('.col-status');

      let q = Number(qtdEl.textContent) + 1;
      qtdEl.textContent = String(q);
      statusEl.innerHTML = badgeHtml(statusFrom(q));

      try {
        const atual = await apiGetPorId(id);
        const req = toProdutoRequestFromResponse(atual, {
          quantidade: q,
          status: statusFrom(q)
        });
        await apiAtualizarProduto(id, req);
      } catch (err) {
        console.error(err);
      }
    });
  });
}

/* =========================
   HANDLER DA LIXEIRA (com modal)
   ========================= */
function wireDeleteHandlers(){
  const container = document.getElementById('lista-produtos');
  if(!container) return;

  container.querySelectorAll('.icon-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const row = e.target.closest('.estoque-row');
      if (!row) return;

      const id = Number(row.dataset.id);
      const nome = row.querySelector('.prod-nome')?.textContent?.trim() || 'este produto';

      produtoParaExcluirId = id;
      produtoParaExcluirBtn = btn;
      btn.setAttribute('aria-disabled', 'true');
      abrirModalExcluirProduto(nome);
    });
  });
}

/* =========================
   BUSCA POR NOME (FORM)
   ========================= */
async function aplicarBusca(termo) {
  const val = (termo || '').trim();
  if (!val) { await carregarProdutos(); return; }
  try {
    const lista = await apiBuscarPorNome(val);
    renderLista(lista);
  } catch (e) {
    console.error(e);
    await carregarProdutos();
  }
}

function initBusca() {
  const form = document.getElementById('buscaForm');
  const input = document.getElementById('buscaInput');
  if (!form || !input) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await aplicarBusca(input.value || '');
  });

  input.addEventListener('search', async () => {
    if ((input.value || '').trim() === '') await carregarProdutos();
  });

  input.addEventListener('input', async () => {
    if (input.value === '') await carregarProdutos();
  });
}

/* =========================
   CRUD EXTRA (usados em fluxos externos)
   ========================= */
async function deletarProduto(id) {
  try {
    await apiDeletarProduto(id);
    await carregarProdutos();
  } catch (e) {
    console.error(e);
  }
}

function editarProduto(id) {
  (async () => {
    try {
      const atual = await apiGetPorId(id);
      const novoNome = prompt('Digite o novo nome do produto:', atual?.nome ?? '');
      if (novoNome == null) return;
      const novoPrecoStr = prompt('Digite o novo preço do produto:', String(atual?.preco ?? '0'));
      if (novoPrecoStr == null) return;

      const novoPreco = Number(novoPrecoStr);
      if (isNaN(novoPreco)) return;

      const req = toProdutoRequestFromResponse(atual, { nome: novoNome, preco: novoPreco });
      await apiAtualizarProduto(id, req);
      await carregarProdutos();
    } catch (e) {
      console.error(e);
    }
  })();
}

/* =========================
   CARREGAR LISTA INICIAL
   ========================= */
async function carregarProdutos() {
  try {
    const lista = await apiListarTodos();
    renderLista(lista);

    // Toast opcional pós-cadastro
    const msg = localStorage.getItem('novo_produto_msg');
    if (msg) {
      try { mostrarToast(msg); } catch {}
      localStorage.removeItem('novo_produto_msg');
    }
  } catch (e) {
    console.error(e);
    renderLista([]);
  }
}

/* =========================
   TOAST (opcional)
   ========================= */
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
  setTimeout(() => toast.classList.add('show'), 30);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 220); }, 2200);
}

/* =========================
   BOOT
   ========================= */
window.addEventListener('load', () => {
  initGreeting();
  initMiniProfile();
  initLogout();
  initBusca();
  carregarProdutos();

  // Botão de cadastro
  const novoBtn = document.getElementById('novoProdutoBtn');
  if (novoBtn) {
    novoBtn.addEventListener('click', () => {
      window.location.href = './cad_produtos.html';
    });
  }

  // Liga botões do modal de exclusão
  const btnOk = document.getElementById('btnConfirmarExcluirProduto');
  const btnCancel = document.getElementById('btnCancelarExcluirProduto');

  btnOk?.addEventListener('click', async () => {
    if (!produtoParaExcluirId) return fecharModalExcluirProduto();
    try {
      await apiDeletarProduto(produtoParaExcluirId);
      fecharModalExcluirProduto();
      await carregarProdutos();
    } catch (err) {
      console.error(err);
      fecharModalExcluirProduto();
      alert('Falha ao excluir o produto.');
    }
  });

  btnCancel?.addEventListener('click', () => fecharModalExcluirProduto());
});
