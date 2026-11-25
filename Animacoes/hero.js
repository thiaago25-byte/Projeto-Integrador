// Transições de rolagem, numa única linha do tempo fixada na tela.
// Cada unidade da linha do tempo corresponde a uma tela de rolagem.
gsap.registerPlugin(ScrollTrigger, CustomEase);

// Curva do Codrops: começa devagar, acelera e assenta suave.
const easeTransicao = CustomEase.create('transicao', 'M0,0 C0.38,0.05 0.48,0.58 0.65,0.82 0.82,1 1,1 1,1');

const sequencia = document.querySelector('.sequencia-sobre');
const secoes = gsap.utils.toArray('.sobre');

// O bloco começa sobre a hero. As seções 2 e 3 ficam empilhadas sobre a 1ª para trocarem no lugar.
gsap.set(sequencia, { marginTop: -document.querySelector('.hero').offsetHeight });
// pointer-events: as seções de cima não bloqueiam cliques; só o botão recebe (ver CSS).
gsap.set(secoes.slice(1), {
  position: 'absolute', top: 0, left: 0, width: '100%',
  backgroundColor: 'transparent', pointerEvents: 'none',
});

const tl = gsap.timeline({
  defaults: { ease: easeTransicao, duration: 1 },
  scrollTrigger: {
    trigger: sequencia,
    start: 'top top',
    end: '+=550%',  // 5,5 telas de rolagem
    pin: true,
    scrub: 0.7,     // segue a rolagem com 0,7s de suavização
  },
});

// Hero → Sobre Nós 1: a hero fica parada e escurece enquanto a "Sobre" sobe e a cobre.
tl.to('.conteudo-hero', { opacity: 0.4 }, 0)
  .fromTo(sequencia, { yPercent: 100 }, { yPercent: 0 }, 0);

// Sobre 1 → 2 → 3: as fotos novas aparecem no lugar, de baixo para cima, e os textos
// trocam por dissolução. Meia tela de pausa entre as trocas.
const partes = (secao) => [
  secao.querySelectorAll('.texto-sobre > *'), // título, rótulo, parágrafos e botão
  secao.querySelector('.foto-principal'),
  secao.querySelector('.foto-detalhe'),
];
const DURACAO = 1.5; // cada troca dura 1,5 tela; fotos e textos começam e terminam juntos
const FECHADA = 'inset(100% 0% 0% 0%)';
const ABERTA = 'inset(0% 0% 0% 0%)';

secoes.slice(1).forEach((nova, i) => {
  const inicio = 1.5 + i * (DURACAO + 0.5);
  const [texto, foto, detalhe] = partes(secoes[i]);
  const [textoNovo, fotoNova, detalheNovo] = partes(nova);

  tl.fromTo([fotoNova, detalheNovo], { clipPath: FECHADA }, { clipPath: ABERTA, duration: DURACAO }, inicio)
    .set([foto, detalhe], { autoAlpha: 0 }, inicio + DURACAO) // só depois que as novas cobrem tudo
    // Texto: o antigo sobe e some; o novo aparece logo depois.
    .to(texto, { autoAlpha: 0, y: -12, duration: DURACAO * 0.5, ease: 'sine.in' }, inicio)
    .fromTo(textoNovo, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: DURACAO * 0.55, ease: 'sine.out' }, inicio + DURACAO * 0.45);
});

tl.to({}, { duration: 0.5 }); // meia tela parada na última seção

// Cabeçalho fixo: fica escuro enquanto as seções "Sobre" (fundo claro) estão por baixo dele (y 65).
const cabecalho = document.querySelector('.cabecalho');
function atualizarCabecalho() {
  const { top, bottom } = sequencia.getBoundingClientRect();
  cabecalho.classList.toggle('claro', top <= 65 && bottom > 65);
}
tl.eventCallback('onUpdate', atualizarCabecalho);

// "Sobre Nós" do menu: rola até a seção cobrir a hero (o bloco começa embaixo dela).
function irParaSobre() {
  const { start, end } = tl.scrollTrigger;
  window.scrollTo(0, start + (end - start) / tl.duration()); // 1ª transição = 1 unidade
}
document.querySelectorAll('a[href$="#sobre-nos"]').forEach((link) => link.addEventListener('click', (e) => {
  e.preventDefault();
  irParaSobre();
}));
if (location.hash === '#sobre-nos') window.addEventListener('load', irParaSobre); // vindo de outra página

