// Tema do site: o escolhido no botao do topo ou, sem escolha, o do sistema operacional.
(function () {
  let tema = null;
  try { tema = localStorage.getItem('tema-do-site'); } catch (erro) { /* sem armazenamento */ }
  if (tema !== 'light' && tema !== 'dark') {
    tema = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', tema);
})();
