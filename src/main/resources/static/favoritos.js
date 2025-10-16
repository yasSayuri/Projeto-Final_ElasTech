// ===== helpers base (mesmo padrão do resto)
function getUserSafe(){ try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } }
const CURRENT_USER = getUserSafe();
const USER_ID = CURRENT_USER?.id || null;
function k(name){ return USER_ID ? `${name}_${USER_ID}` : name; }

function mostrarToast(msg){
  const antigo = document.querySelector('.toast'); if (antigo) antigo.remove();
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(()=> t.classList.add('show'));
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(), 250); }, 2200);
}

// ===== favoritos storage
function loadFavoritos(){ return JSON.parse(localStorage.getItem(k('favoritos')) || '[]'); }
function saveFavoritos(favs){ localStorage.setItem(k('favoritos'), JSON.stringify(favs)); }
function removerFavorito(id){
  let favs = loadFavoritos();
  favs = favs.filter(f => Number(f.id) !== Number(id));
  saveFavoritos(favs);
  renderFavoritos();
  mostrarToast('Removido dos favoritos!');
}

// ===== render
function brl(n){ return Number(n||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); }

function renderFavoritos(){
  const body = document.querySelector('.fav-body');
  const favs = loadFavoritos();

  if (!favs.length){
    body.innerHTML = `<div class="empty">Você ainda não tem favoritos.</div>`;
    return;
  }

  body.innerHTML = favs.map(p => `
    <div class="fav-row" data-id="${p.id}">
      <div class="prod">
        <div class="thumb" style="background-image:url('${p.img || './assets/placeholder.png'}')"></div>
        <div class="info">
          <div class="name">${p.nome}</div>
          <div class="attrs">${p.categoria || ''}</div>
        </div>
      </div>
      <div class="price">${brl(p.preco)}</div>
      <div class="actions">
        <span class="material-icons remove-icon" title="Remover" onclick="removerFavorito(${p.id})">delete</span>
      </div>
    </div>
  `).join('');
}

// boot
renderFavoritos();
