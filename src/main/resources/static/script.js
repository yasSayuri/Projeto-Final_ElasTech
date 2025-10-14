const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-sidebar');
const content = document.querySelector('.content');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('closed');   // abre ou fecha a sidebar
    sidebar.classList.toggle('open');     // rotaciona a seta
    content.classList.toggle('sidebar-open'); // ajusta o conteúdo
});