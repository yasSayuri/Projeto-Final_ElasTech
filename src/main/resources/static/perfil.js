(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const byId = (id) => document.getElementById(id);
  const jget = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };

  function mostrarToast(msg) {
    const antigo = document.querySelector('.toast');
    if (antigo) antigo.remove();
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 250); }, 2200);
  }

  let user = jget('user');

  async function fetchMe() {
    try {
      const r = await fetch('/api/usuarios/me', { headers: { 'Accept': 'application/json' } });
      if (!r.ok) return null;
      const me = await r.json();
      if (me && me.id) localStorage.setItem('user', JSON.stringify(me));
      return me;
    } catch { return null; }
  }

  async function ensureUser() {
    if (user && user.id) return user;
    const me = await fetchMe();
    if (me && me.id) { user = me; return me; }
    window.location.href = './index.html?login=required';
    return null;
  }

  function formatTelefone(s) {
    const d = (s || '').replace(/\D/g, '');
    if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
    return s || '';
  }

  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  function getSpanVal(span, field) {
    if (!span) return '';
    const input = span.querySelector('input');
    if (input) return input.value || '';
    const text = (span.textContent || '').trim();
    return field === 'telefone' ? text.replace(/\D/g, '') : text;
  }

  function brl(v) { const n = Number(v ?? 0); return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
  function statusClass(s) {
    const k = String(s || '').toUpperCase();
    if (['ENTREGUE', 'PAGO', 'ENVIADO'].includes(k)) return 'entregue';
    if (k === 'CANCELADO') return 'cancelado';
    return 'processando';
  }

  function totalPedido(p) {
    const subtotal = Number(p.subtotal ?? 0);
    const desconto = Number(p.descontoTotal ?? 0);
    const frete = Number(p.frete ?? 0);
    const t = (p.total != null) ? Number(p.total) : (subtotal - desconto + frete);
    return isNaN(t) ? 0 : t;
  }

  function getCategoriasStore() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const key = user?.id ? `categorias_por_pedido_${user.id}` : 'categorias_por_pedido';
    try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
  }

  function categoriasSnapshot(pedidoId) {
    const store = getCategoriasStore();
    const entry = store[String(pedidoId)];
    if (!entry) return '—';
    return (typeof entry === 'string') ? entry : (entry.categorias || '—');
  }

  function thumbSnapshot(pedidoId) {
    const store = getCategoriasStore();
    const entry = store[String(pedidoId)];
    if (!entry || typeof entry === 'string') return null;
    return entry.thumb || null;
  }

  async function init() {
    const u = await ensureUser();
    if (!u) return;

    const isAdmin = String(u.role || '').toUpperCase() === 'ADMIN';

    // === Toggle senha ===
    const btnToggleSenha = byId('btnToggleSenha');
    const formSenha = byId('formSenha');
    if (btnToggleSenha && formSenha) {
      btnToggleSenha.addEventListener('click', () => {
        const aberto = getComputedStyle(formSenha).display !== 'none';
        formSenha.style.display = aberto ? 'none' : 'block';
        btnToggleSenha.setAttribute('aria-expanded', String(!aberto));
        btnToggleSenha.textContent = aberto ? 'Alterar senha' : 'Cancelar';
        if (!aberto) {
          const ns = byId('novaSenha');
          const cs = byId('confirmaSenha');
          const err1 = byId('err-senha');
          const err2 = byId('err-confirma');
          if (ns) ns.value = '';
          if (cs) cs.value = '';
          if (err1) { err1.textContent = ''; err1.style.display = 'none'; }
          if (err2) { err2.textContent = ''; err2.style.display = 'none'; }
          setTimeout(() => ns?.focus(), 0);
        }
      });
    }

    // === Modal de exclusão ===
    const btnExcluir = byId('btnExcluirConta');
    const modalExcluir = byId('modalExcluir');
    const btnConfirmarExcluir = byId('btnConfirmarExcluir');
    const btnCancelarExcluir = byId('btnCancelarExcluir');
    if (btnExcluir && modalExcluir) {
      btnExcluir.addEventListener('click', () => modalExcluir.classList.add('show'));
      btnCancelarExcluir?.addEventListener('click', () => modalExcluir.classList.remove('show'));
      btnConfirmarExcluir?.addEventListener('click', async () => {
        const me = await ensureUser();
        if (!me) return;
        try {
          const r = await fetch(`/api/usuarios/${me.id}`, { method: 'DELETE' });
          if (r.ok || r.status === 204) {
            modalExcluir.classList.remove('show');
            localStorage.clear();
            window.location.href = './index.html?account=deleted';
            return;
          }
          mostrarToast('Erro ao excluir conta.');
        } catch {
          mostrarToast('Falha de conexão.');
        }
      });
    }

    // === Dados do usuário ===
    const vNome = byId('vNome'), vEmail = byId('vEmail'), vTelefone = byId('vTelefone');
    if (vNome) vNome.textContent = u.nome || '';
    if (vEmail) vEmail.textContent = u.email || '';
    if (vTelefone) vTelefone.textContent = formatTelefone(u.telefone || '');

    const original = {
      nome: (vNome?.textContent || '').trim(),
      email: (vEmail?.textContent || '').trim(),
      telefone: (u.telefone || '').replace(/\D/g, ''),
    };

    // === Edição inline ===
    document.querySelectorAll('.edit-icon[data-field]').forEach((icon) => {
      icon.addEventListener('click', () => {
        const field = icon.getAttribute('data-field');
        const span = document.querySelector('#v' + cap(field));
        if (!span) return;
        if (span.querySelector('input')) { span.querySelector('input').focus(); return; }
        const currentText = span.textContent.trim();
        const input = document.createElement('input');
        input.className = 'inline-input';
        input.type = field === 'email' ? 'email' : 'text';
        input.value = field === 'telefone' ? (original.telefone || '') : currentText;
        span.textContent = '';
        span.appendChild(input);
        input.focus(); input.select();
        input.addEventListener('blur', () => {
          const val = input.value.trim();
          span.textContent = field === 'telefone' ? formatTelefone(val) : val;
        });
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') input.blur();
          if (e.key === 'Escape') {
            span.textContent = field === 'telefone' ? formatTelefone(original.telefone)
              : (field === 'nome' ? original.nome : original.email);
          }
        });
      });
    });

    // === Botão Salvar ===
    $('.btn-save')?.addEventListener('click', async () => {
      ['nome','email','telefone'].forEach(k => { const el = byId('err-' + k); if (el) { el.textContent=''; el.style.display='none'; } });
      const nomeAtual = getSpanVal(vNome, 'nome');
      const emailAtual = getSpanVal(vEmail, 'email');
      const telAtual   = getSpanVal(vTelefone, 'telefone');
      const draft = { nome: nomeAtual.trim(), email: emailAtual.trim(), telefone: telAtual.replace(/\D/g,'') };
      const payload = {};
      if (draft.nome !== original.nome) payload.nome = draft.nome;
      if (draft.email !== original.email) payload.email = draft.email;
      if (draft.telefone !== original.telefone) payload.telefone = draft.telefone;

      const f = byId('formSenha');
      if (f && f.style.display !== 'none') {
        const s1 = byId('novaSenha')?.value?.trim() || '';
        const s2 = byId('confirmaSenha')?.value?.trim() || '';
        if (s1 || s2) {
          if (s1.length < 8) { byId('err-senha').textContent='Mínimo 8 caracteres'; byId('err-senha').style.display='block'; return; }
          if (s1 !== s2) { byId('err-confirma').textContent='As senhas não conferem'; byId('err-confirma').style.display='block'; return; }
          payload.senha = s1;
        }
      }

      if (!Object.keys(payload).length) return mostrarToast('Nada para atualizar.');

      try {
        const r = await fetch(`/api/usuarios/${u.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (r.ok) {
          const updated = await r.json();
          user = { ...u, ...updated };
          localStorage.setItem('user', JSON.stringify(user));
          if (vNome) vNome.textContent = user.nome || '';
          if (vEmail) vEmail.textContent = user.email || '';
          if (vTelefone) vTelefone.textContent = formatTelefone(user.telefone || '');
          mostrarToast('Dados atualizados com sucesso!');
        } else mostrarToast('Erro ao salvar alterações.');
      } catch { mostrarToast('Falha de conexão.'); }
    });

    // === Personalização Admin ===
	if (isAdmin) {
	  // marca o body para CSS escopado
	  document.body.classList.add('is-admin');

	  // remove seção de pedidos/divisor
	  document.querySelector('.pedidos')?.remove();
	  document.querySelector('.divider')?.remove();

	  // botão voltar → estoque
	  const back = document.querySelector('.back-link');
	  if (back) {
	    back.textContent = 'Voltar ao estoque';
	    back.href = './admin.html';
	  }

	  // recria o NAV com o markup do admin.html
	  const first = (u.nome || 'Admin').trim().split(/\s+/)[0];
	  const nav = document.querySelector('nav');
	  if (nav) {
	    nav.innerHTML = `
	      <div class="nav-inner">
	        <div class="left-group">
	          <p class="brand">CodeStore</p>
	        </div>

	        <h1 class="admin-title">Área Administrativa</h1>

	        <div class="icons">
	          <span id="greet" class="greet">Bem-vindo, <strong id="firstName">${first}</strong>!</span>

	          <div class="profile-wrap" id="profileWrap" aria-haspopup="true" aria-expanded="false">
	            <a class="profile-link" href="./perfil.html" aria-label="Ir para o perfil">
	              <span class="material-icons">person</span>
	            </a>

	          </div>
	        </div>
	      </div>`;
	  }

	  // tira a busca/carrinho da versão loja (se existirem)
	  document.querySelector('form.search')?.remove();
	  document.getElementById('cartWrap')?.remove();

	  // reatacha interações do mini-profile e logout
	  const profileWrap = document.getElementById('profileWrap');
	  let profileHideTimer;
	  profileWrap?.addEventListener('mouseenter', () => {
	    clearTimeout(profileHideTimer);
	    profileWrap.classList.add('open');
	    profileWrap.setAttribute('aria-expanded', 'true');
	  });
	  profileWrap?.addEventListener('mouseleave', () => {
	    profileHideTimer = setTimeout(() => {
	      profileWrap.classList.remove('open');
	      profileWrap.setAttribute('aria-expanded', 'false');
	    }, 120);
	  });
	  profileWrap?.addEventListener('click', (e) => {
	    const link = e.target.closest('.profile-link');
	    if (link) { window.location.href = './perfil.html'; return; }
	    const isOpen = profileWrap.classList.toggle('open');
	    profileWrap.setAttribute('aria-expanded', String(isOpen));
	  });
	  document.getElementById('logoutBtn')?.addEventListener('click', () => {
	    localStorage.clear();
	    window.location.href = './index.html';
	  });

	} else {
	  carregarPedidosDoUsuario(u.id);
	}


  }

  function carregarPedidosDoUsuario(uid) {
    fetch(`/api/pedidos/usuario/${uid}`)
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(lista => renderPedidos(Array.isArray(lista) ? lista : []))
      .catch(() => renderPedidos([]));
  }

  function renderPedidos(pedidos) {
    const tbody = document.querySelector('.tabela-pedidos tbody');
    if (!tbody) return;

    if (!pedidos.length) {
      tbody.innerHTML = `<tr><td colspan="3" style="padding:16px;color:#6b7280">Você ainda não tem pedidos.</td></tr>`;
      return;
    }

    tbody.innerHTML = pedidos.map(p => {
      const placeholder = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='80'><rect width='120' height='80' fill='%23f3f4f6'/></svg>";
      const thumb = thumbSnapshot(p.id) || placeholder;
      return `
        <tr>
          <td>
            <div class="pedido-info">
              <div class="foto-produto">
                <img src="${thumb}" alt="Pedido #${p.id}" />
              </div>
              <div class="detalhes-pedido">
                <strong>id: ${p.id ?? '-'}</strong><br>
                ${categoriasSnapshot(p.id)}
              </div>
            </div>
          </td>
          <td>${brl(totalPedido(p))}</td>
          <td><span class="status ${statusClass(p.status)}">${p.status ?? 'PENDENTE'}</span></td>
        </tr>`;
    }).join('');
  }

  init();
})();
