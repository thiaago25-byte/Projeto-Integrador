// Menu de tela cheia: o hambúrguer abre e fecha; Esc e os links também fecham.
// Nomes diferentes dos outros scripts, que dividem as mesmas variáveis globais.
const cabecalhoMenu = document.querySelector('.cabecalho');
const botaoMenu = cabecalhoMenu.querySelector('.menu');

function alternarMenu(abrir) {
  cabecalhoMenu.classList.toggle('aberto', abrir);
  botaoMenu.setAttribute('aria-expanded', abrir);
  botaoMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
}

botaoMenu.addEventListener('click', () => alternarMenu(!cabecalhoMenu.classList.contains('aberto')));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cabecalhoMenu.classList.contains('aberto')) {
    alternarMenu(false);
    botaoMenu.focus(); // o foco volta ao hambúrguer, em vez de se perder no menu escondido
  }
});

cabecalhoMenu.querySelectorAll('.navegacao a').forEach((link) => link.addEventListener('click', (e) => {
  if (link.getAttribute('aria-disabled') === 'true') { // Contato: a página ainda não existe
    e.preventDefault();
    return;
  }
  alternarMenu(false);
}));
