/* ========= header/admin helpers ========= */
function getUserSafe(){ try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } }
const CURRENT_USER = getUserSafe();
function getFirstName(nome){
  if(!nome) return 'Visitante';
  const p = (nome || '').trim().split(/\s+/);
  return p[0] || 'Visitante';
}
function initGreeting(){
  var first = getFirstName(CURRENT_USER && CURRENT_USER.nome);
  var fn = document.getElementById('firstName');
  var mn = document.getElementById('miniName');
  if(fn) fn.textContent = first;
  if(mn) mn.textContent = first;
}
function initMiniProfile(){
  var profileWrap = document.getElementById('profileWrap');
  var t;
  if(!profileWrap) return;
  profileWrap.addEventListener('mouseenter', function(){
    clearTimeout(t);
    profileWrap.classList.add('open');
    profileWrap.setAttribute('aria-expanded','true');
  });
  profileWrap.addEventListener('mouseleave', function(){
    t = setTimeout(function(){
      profileWrap.classList.remove('open');
      profileWrap.setAttribute('aria-expanded','false');
    }, 120);
  });
  profileWrap.addEventListener('click', function(e){
    var link = e.target.closest && e.target.closest('.profile-link');
    if(link){ window.location.href = './perfil.html'; return; }
    var isOpen = profileWrap.classList.toggle('open');
    profileWrap.setAttribute('aria-expanded', String(isOpen));
  });
  document.addEventListener('click', function(e){
    if(!profileWrap.contains(e.target)){
      profileWrap.classList.remove('open');
      profileWrap.setAttribute('aria-expanded','false');
    }
  });
}
function initLogout(){
  var btn = document.getElementById('logoutBtn');
  if(!btn) return;
  btn.addEventListener('click', function(){
    localStorage.removeItem('user');
    localStorage.removeItem('carrinho');
    localStorage.removeItem('pedidoId');
    localStorage.removeItem('categorias_por_pedido');
    window.location.href = './index.html';
  });
}

/* ========= endpoints (use caminho relativo) ========= */
var API_JSON = '/api/produtos/salvar';

/* ========= mensagens inline ========= */
function showMsg(msg, ok){
  var el = document.getElementById('formMsg');
  if(!el) return;
  el.style.color = ok ? '#166534' : '#b91c1c';
  el.textContent = msg || '';
}

/* ========= normaliza número ========= */
function sanitizeNumber(v){
  if(typeof v === 'number') return v;
  if(!v && v !== 0) return 0;
  return Number(String(v).replace(',','.'));
}
function toInteger(v){
  if (typeof v === 'number') return Math.trunc(v);
  if(!v && v !== 0) return NaN;
  var n = Number(String(v).replace(',','.'));
  return Number.isFinite(n) ? Math.trunc(n) : NaN;
}

/* ========= preview ========= */
function initPreview(){
  var input = document.getElementById('foto');
  var img = document.getElementById('previewImg');
  if(!input || !img) return;

  input.addEventListener('change', function(){
    var f = input.files && input.files[0];
    if(!f){ img.style.display='none'; img.src=''; return; }
    var ok = ['image/jpeg','image/png','image/jpg'].indexOf(f.type) >= 0;
    if(!ok){
      showMsg('Use arquivos JPG ou PNG.');
      input.value='';
      img.style.display='none';
      return;
    }
    img.src = URL.createObjectURL(f);
    img.onload = function(){ URL.revokeObjectURL(img.src); };
    img.style.display='block';
  });
}

/* ========= file input custom (via <label for="foto">) ========= */
function initCustomFileInput(){
  var input = document.getElementById('foto');
  var fileName = document.getElementById('fileName');
  if(!input) return;

  input.addEventListener('change', function(){
    var f = input.files && input.files[0];
    if(fileName) fileName.textContent = f ? f.name : 'Nenhum arquivo selecionado';
  });
}

/* ========= toast compatível ========= */
function garantirEstilosToast(){
  if(document.querySelector('style[data-toast]')) return;
  var s = document.createElement('style');
  s.setAttribute('data-toast','');
  s.textContent = ".toast{position:fixed;top:10%;left:50%;transform:translate(-50%,-50%);background:#FFD166;color:#fff;padding:14px 28px;border-radius:12px;font-weight:700;box-shadow:0 4px 15px rgba(0,0,0,.25);opacity:0;transition:all .3s ease;z-index:2000}.toast.show{opacity:1;transform:translate(-50%,-50%) scale(1.05)}";
  document.head.appendChild(s);
}
function mostrarToast(mensagem){
  garantirEstilosToast();
  var antigo = document.querySelector('.toast');
  if(antigo) antigo.remove();
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = mensagem;
  document.body.appendChild(toast);
  setTimeout(function(){ toast.classList.add('show'); }, 30);
  setTimeout(function(){
    toast.classList.remove('show');
    setTimeout(function(){ toast.remove(); }, 220);
  }, 2200);
}

/* ========= imagem local (override p/ loja) ========= */
function imgKey(id){ return 'img_override_' + id; }
function fileToDataURL(file){
  return new Promise(function(res, rej){
    var r = new FileReader();
    r.onload = function(){ res(r.result); };
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ===== reset do form pós-sucesso =====
function resetForm(){
  const form = document.getElementById('formProduto');
  if (form) form.reset();
  const img=document.getElementById('previewImg');
  const fileName=document.getElementById('fileName');
  if(img){ img.src=''; img.style.display='none'; }
  if(fileName) fileName.textContent='Nenhum arquivo selecionado';
  document.getElementById('nome')?.focus();
}

/* ========= submit do cadastro ========= */
async function submitProduto(e){
  e.preventDefault();
  showMsg('');

  var nome = (document.getElementById('nome') && document.getElementById('nome').value || '').trim();
  var descricao = (document.getElementById('descricao') && document.getElementById('descricao').value || '').trim();
  var preco = sanitizeNumber(document.getElementById('preco') && document.getElementById('preco').value);
  var categoriaProduto = document.getElementById('categoriaProduto') && document.getElementById('categoriaProduto').value;
  var quantidadeStr = document.getElementById('quantidade') && document.getElementById('quantidade').value;
  var quantidade = toInteger(quantidadeStr);
  var fotoFile = (document.getElementById('foto') && document.getElementById('foto').files && document.getElementById('foto').files[0]) || null;

  // validações
  if(!nome || !descricao || !categoriaProduto || !preco || preco < 0.1){
    showMsg('Preencha todos os campos corretamente (preço mínimo 0,10).');
    mostrarToast('Falha ao cadastrar');
    return;
  }
  if(descricao.length < 5){
    showMsg('A descrição deve ter ao menos 5 caracteres.');
    mostrarToast('Falha ao cadastrar');
    return;
  }
  if(Number.isNaN(quantidade) || quantidade < 0){
    showMsg('Quantidade inválida (mínimo 0).');
    mostrarToast('Falha ao cadastrar');
    return;
  }

  try{
    // Salva no backend (JSON)
    var payload = {
      nome: nome,
      descricao: descricao,
      preco: preco,
      categoriaProduto: categoriaProduto,
      quantidade: quantidade     // <<<<<< OBRIGATÓRIO PARA PASSAR NA VALIDAÇÃO DO BACKEND
    };

    var resp = await fetch(API_JSON, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(payload)
    });

    if(!resp.ok){
      showMsg('Falha ao salvar produto.');
      mostrarToast('Falha ao cadastrar');
      return;
    }

    var data = await resp.json().catch(function(){ return null; });
    var novoId = data && data.id;

    // Se teve foto, guarda base64 no localStorage para a loja/admin usar como override
    if(novoId && fotoFile){
      try{
        var dataUrl = await fileToDataURL(fotoFile);
        localStorage.setItem(imgKey(novoId), dataUrl);
      }catch(_e){}
    }

    mostrarToast('Cadastrado com sucesso');
    resetForm();
    localStorage.setItem('novo_produto_msg', 'Produto "' + nome + '" cadastrado!');

  }catch(err){
    showMsg('Erro de comunicação com o servidor.');
    mostrarToast('Falha ao cadastrar');
  }
}

/* ========= bootstrap ========= */
window.addEventListener('DOMContentLoaded', function(){
  initGreeting();
  initMiniProfile();
  initLogout();
  initPreview();
  initCustomFileInput();

  var form = document.getElementById('formProduto');
  if(form) form.addEventListener('submit', submitProduto);
});
