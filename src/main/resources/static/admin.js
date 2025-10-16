function getUserSafe(){ try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } }
const CURRENT_USER = getUserSafe();

function getFirstName(nome){
  if(!nome) return 'Visitante';
  const p = nome.trim().split(/\s+/);
  return p[0] || 'Visitante';
}

async function carregarProdutos(){
  try{
    const r = await fetch('http://localhost:8080/api/produtos');
    if(!r.ok) throw new Error('API');
    const lista = await r.json();
    const el = document.getElementById('lista-produtos');
    el.innerHTML = '';
    lista.forEach(prod => {
      el.innerHTML += `
	  <div class="produto" data-id="${prod.id}">
	    <h3>${prod.nome}</h3>
	    <p class="preco">R$ ${Number(prod.preco).toFixed(2)}</p>
	    <div class="acoes">
	      <button class="btn-editar" onclick="editarProduto(${prod.id})">
	        <i class="fa-solid fa-pen-to-square"></i> Editar
	      </button>
	      <button class="btn-deletar" onclick="deletarProduto(${prod.id})">
	        <i class="fa-solid fa-trash"></i> Deletar
	      </button>
	    </div>
	  </div>
      `;
    });
  }catch(e){ console.error(e); }
}

async function deletarProduto(id){
  try{
    await fetch(`http://localhost:8080/api/produtos/${id}`,{ method:'DELETE' });
    carregarProdutos();
  }catch(e){ console.error(e); }
}

function editarProduto(id){
  const novoNome = prompt('Digite o novo nome do produto:');
  const novoPreco = prompt('Digite o novo preço do produto:');
  if(novoNome && novoPreco){
    atualizarProduto(id,{ nome: novoNome, preco: parseFloat(novoPreco) });
  }
}

async function atualizarProduto(id, novoProduto){
  try{
    await fetch(`http://localhost:8080/api/produtos/${id}`,{
      method:'PUT',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(novoProduto)
    });
    carregarProdutos();
  }catch(e){ console.error(e); }
}

function initGreeting(){
  const first = getFirstName(CURRENT_USER?.nome);
  const fnEl = document.getElementById('firstName');
  const miniName = document.getElementById('miniName');
  if(fnEl) fnEl.textContent = first;
  if(miniName) miniName.textContent = first;
}

function initMiniProfile(){
  const profileWrap = document.getElementById('profileWrap');
  let t;
  if(!profileWrap) return;
  profileWrap.addEventListener('mouseenter',()=>{
    clearTimeout(t);
    profileWrap.classList.add('open');
    profileWrap.setAttribute('aria-expanded','true');
  });
  profileWrap.addEventListener('mouseleave',()=>{
    t = setTimeout(()=>{
      profileWrap.classList.remove('open');
      profileWrap.setAttribute('aria-expanded','false');
    },120);
  });
  profileWrap.addEventListener('click',(e)=>{
    const link = e.target.closest('.profile-link');
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

window.addEventListener('load', ()=>{
  initGreeting();
  initMiniProfile();
  initLogout();
  carregarProdutos();
  const novoBtn = document.getElementById('novoProdutoBtn');
  if (novoBtn) novoBtn.addEventListener('click', ()=>{ window.location.href = './cad_produtos.html'; });
});


