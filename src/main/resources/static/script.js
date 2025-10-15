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


const elLista = document.getElementById('produtos');
const links = document.querySelectorAll('.cat-link');
const iconeFavorito = '<span class="material-icons" style="color:#FFD700;">favorite</span>';
const iconeCarrinho = '<span class="material-icons">shopping_cart</span>';

function formatarPreco(v){return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}

function cardTemplate(p){
  return `
    <div class="produto">
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

render(produtos.filter(p=>p.categoria==="Computadores"));
