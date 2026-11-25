// Páginas de coleção: o cabeçalho usa as cores da HERO enquanto uma seção escura (.fundo-escuro)
// passa por baixo dele (y 65); no resto da página fica escuro, sobre o fundo branco.
const secoesEscuras = document.querySelectorAll('.fundo-escuro');
const cabecalhoColecao = document.querySelector('.cabecalho');

function atualizarCabecalho() {
  const sobreEscura = [...secoesEscuras].some((secao) => {
    const { top, bottom } = secao.getBoundingClientRect();
    return top < 65 && bottom > 65;
  });
  cabecalhoColecao.classList.toggle('claro', !sobreEscura);
}

window.addEventListener('scroll', atualizarCabecalho, { passive: true });
atualizarCabecalho();
