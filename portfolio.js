// Página Portfólio: carrossel em loop, como o do site oficial, e revelação dos textos.
gsap.registerPlugin(ScrollTrigger, CustomEase);

const portfolio = document.querySelector('.portfolio');
const trilha = portfolio.querySelector('.trilha');
const bolinhas = portfolio.querySelectorAll('.bolinha');
const total = bolinhas.length;
const easeCarrossel = CustomEase.create('carrossel', '0.25, 0.1, 0.25, 1'); // "ease" do CSS, como no original
let atual = 0; // coleção mais à esquerda
let andando = false;

// Desliza até a coleção pedida pelo caminho mais curto. No fim, as coleções que saíram
// por um lado são movidas para o outro, e a trilha volta para x 0 (assim o loop não acaba).
function irPara(destino) {
  let passos = (destino - atual + total) % total;
  if (andando || passos === 0) return;
  if (passos > total / 2) passos -= total; // voltar é mais perto

  andando = true;
  atual = destino;
  bolinhas.forEach((bolinha, i) => bolinha.classList.toggle('ativa', i === atual));

  const largura = trilha.firstElementChild.offsetWidth;
  const fim = () => { andando = false; };

  if (passos > 0) {
    gsap.to(trilha, {
      x: -largura * passos, duration: 0.8, ease: easeCarrossel,
      onComplete: () => {
        for (let i = 0; i < passos; i++) trilha.append(trilha.firstElementChild);
        gsap.set(trilha, { x: 0 });
        fim();
      },
    });
  } else {
    for (let i = 0; i < -passos; i++) trilha.prepend(trilha.lastElementChild);
    gsap.fromTo(trilha, { x: largura * passos }, { x: 0, duration: 0.8, ease: easeCarrossel, onComplete: fim });
  }
}

const proxima = () => irPara((atual + 1) % total);
const anterior = () => irPara((atual - 1 + total) % total);

bolinhas.forEach((bolinha, i) => bolinha.addEventListener('click', () => irPara(i)));

// Setas do teclado (menos com o menu aberto).
document.addEventListener('keydown', (e) => {
  if (document.querySelector('.cabecalho.aberto')) return;
  if (e.key === 'ArrowRight') proxima();
  if (e.key === 'ArrowLeft') anterior();
});

// Roda do mouse: uma coleção por gesto (eventos com menos de 200ms são o mesmo gesto).
// Na primeira e na última coleção, a página rola normalmente.
let ultimaRoda = 0;
portfolio.addEventListener('wheel', (e) => {
  if (e.ctrlKey || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // zoom ou gesto horizontal
  const avancar = e.deltaY > 0;
  if (avancar ? atual === total - 1 : atual === 0) return;
  e.preventDefault();
  const novoGesto = e.timeStamp - ultimaRoda > 200;
  ultimaRoda = e.timeStamp;
  if (novoGesto) avancar ? proxima() : anterior();
}, { passive: false });

// Arrastar com o mouse ou o dedo: mais de 40px troca de coleção.
let inicioArraste = null;
let arrastou = false;
portfolio.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return; // só o botão esquerdo (ou o dedo)
  inicioArraste = e.clientX;
  arrastou = false;
});
portfolio.addEventListener('pointerup', (e) => {
  if (inicioArraste === null) return;
  const distancia = e.clientX - inicioArraste;
  inicioArraste = null;
  if (Math.abs(distancia) < 40) return;
  arrastou = true;
  distancia < 0 ? proxima() : anterior();
});
// Depois de arrastar, o clique não abre o link da coleção.
portfolio.addEventListener('click', (e) => {
  if (arrastou) { e.preventDefault(); arrastou = false; }
}, true);
// Sem o arraste nativo de imagens e links do navegador.
portfolio.addEventListener('dragstart', (e) => e.preventDefault());

// Textos revelados uma vez, quando a seção aparece (logo ao abrir a página).
portfolio.classList.add('oculto');
ScrollTrigger.create({
  trigger: portfolio,
  start: 'top 60%',
  once: true,
  onEnter: () => portfolio.classList.replace('oculto', 'revelado'),
});
