(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const byId = (id) => document.getElementById(id);
  const jget = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
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

  function getSpanVal(span, field) {
    if (!span) return '';
    const input = span.querySelector('input');
    if (input) return input.value || '';
    const text = (span.textContent || '').trim();
    return field === 'telefone' ? text.replace(/\D/g, '') : text;
  }

  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  function brl(v){
    const n = Number(v ?? 0);
    return n.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
  }

  function statusClass(s){
    const k = String(s||'').toUpperCase();
    if (['ENTREGUE','PAGO','ENVIADO'].includes(k)) return 'entregue';
    if (k === 'CANCELADO') return 'cancelado';
    return 'processando';
  }

  function totalPedido(p){
    const subtotal = Number(p.subtotal ?? 0);
    const desconto = Number(p.descontoTotal ?? 0);
    const frete = Number(p.frete ?? 0);
    const t = (p.total != null) ? Number(p.total) : (subtotal - desconto + frete);
    return isNaN(t) ? 0 : t;
  }

  async function init() {
    const u = await ensureUser();
    if (!u) return;

    const vNome = byId('vNome');
    const vEmail = byId('vEmail');
    const vTelefone = byId('vTelefone');

    if (vNome) vNome.textContent = u.nome || u.name || '';
    if (vEmail) vEmail.textContent = u.email || '';
    if (vTelefone) vTelefone.textContent = formatTelefone(u.telefone || u.phone || '');

    const original = {
      nome: (vNome?.textContent || '').trim(),
      email: (vEmail?.textContent || '').trim(),
      telefone: (u.telefone || u.phone || '').replace(/\D/g, ''),
    };

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
        input.focus();
        input.select();
        input.addEventListener('blur', () => {
          const val = input.value.trim();
          span.textContent = field === 'telefone' ? formatTelefone(val) : val;
        });
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') input.blur();
          if (e.key === 'Escape') {
            span.textContent = field === 'telefone' ? formatTelefone(original.telefone) :
              (field === 'nome' ? original.nome : original.email);
          }
        });
      });
    });

    $('.btn-save')?.addEventListener('click', async () => {
      ['nome','email','telefone'].forEach(k => { const el = byId('err-' + k); if (el) { el.textContent=''; el.style.display='none'; } });

      const nomeAtual = getSpanVal(vNome, 'nome');
      const emailAtual = getSpanVal(vEmail, 'email');
      const telAtual   = getSpanVal(vTelefone, 'telefone');

      const draft = {
        nome: (nomeAtual || '').trim(),
        email: (emailAtual || '').trim(),
        telefone: (telAtual || '').replace(/\D/g, ''),
      };

      const payload = {};
      if (draft.nome !== original.nome) payload.nome = draft.nome;
      if (draft.email !== original.email) payload.email = draft.email;
      if (draft.telefone !== original.telefone) payload.telefone = draft.telefone;

      const f = byId('formSenha');
      if (f && f.style.display !== 'none') {
        const s1 = byId('novaSenha')?.value?.trim() || '';
        const s2 = byId('confirmaSenha')?.value?.trim() || '';
        if (byId('err-senha')) { byId('err-senha').textContent=''; byId('err-senha').style.display='none'; }
        if (byId('err-confirma')) { byId('err-confirma').textContent=''; byId('err-confirma').style.display='none'; }
        if (s1 || s2) {
          if (s1.length < 8) { byId('err-senha').textContent='Mínimo 8 caracteres'; byId('err-senha').style.display='block'; return; }
          if (s1 !== s2) { byId('err-confirma').textContent='As senhas não conferem'; byId('err-confirma').style.display='block'; return; }
          payload.senha = s1;
        }
      }

      if (!Object.keys(payload).length) { alert('Nada para atualizar.'); return; }

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
          original.nome = (vNome?.textContent || '').trim();
          original.email = (vEmail?.textContent || '').trim();
          original.telefone = (user.telefone || '').replace(/\D/g, '');
          if (f) { const ns = byId('novaSenha'); const cs = byId('confirmaSenha'); if (ns) ns.value=''; if (cs) cs.value=''; }
          alert('Dados atualizados com sucesso!');
          return;
        }

        if (r.status === 400) {
          const j = await r.json().catch(() => null);
          if (j?.errors) {
            for (const [field, message] of Object.entries(j.errors)) {
              const el = byId('err-' + field);
              if (el) { el.textContent = message; el.style.display = 'block'; }
            }
            return;
          }
          alert(j?.message || 'Erro de validação.');
          return;
        }

        if (r.status === 409) {
          const j = await r.json().catch(() => null);
          const el = byId('err-email');
          if (el) { el.textContent = (j?.message || 'E-mail já cadastrado.'); el.style.display = 'block'; }
          return;
        }

        alert('Erro ao salvar alterações.');
      } catch {
        alert('Falha de conexão.');
      }
    });

    const btnToggleSenha = byId('btnToggleSenha');
    btnToggleSenha?.addEventListener('click', () => {
      const form = byId('formSenha');
      if (!form) return;
      form.style.display = (form.style.display === 'none' || !form.style.display) ? 'block' : 'none';
    });

    carregarPedidosDoUsuario(u.id);
  }

  function carregarPedidosDoUsuario(uid){
    fetch(`/api/pedidos/usuario/${uid}`)
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(lista => renderPedidos(Array.isArray(lista) ? lista : []))
      .catch(() => renderPedidos([]));
  }

  function renderPedidos(pedidos){
    const tbody = document.querySelector('.tabela-pedidos tbody');
    if (!tbody) return;
    if (!pedidos.length) {
      tbody.innerHTML = `<tr><td colspan="3" style="padding:16px;color:#6b7280">Você ainda não tem pedidos.</td></tr>`;
      return;
    }
    tbody.innerHTML = pedidos.map(p => `
      <tr>
        <td>
          <div class="pedido-info">
            <div class="foto-produto"><img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='80'><rect width='120' height='80' fill='%23f3f4f6'/></svg>" alt="Pedido"></div>
            <div class="detalhes-pedido">
              <strong>#${p.id ?? '-'}</strong><br>
              Pedido do usuário ${p.usuarioId ?? '-'}
            </div>
          </div>
        </td>
        <td>${brl(totalPedido(p))}</td>
        <td><span class="status ${statusClass(p.status)}">${p.status ?? 'PENDENTE'}</span></td>
      </tr>
    `).join('');
  }

  init();
})();
