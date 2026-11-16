// Transições de rolagem, numa única linha do tempo fixada na tela.
// Cada unidade da linha do tempo corresponde a uma tela de rolagem.
gsap.registerPlugin(ScrollTrigger, CustomEase);

// Curva do demo do Codrops (async-page-transitions): começa devagar, acelera e assenta suave.
const easeTransicao = CustomEase.create('transicao', 'M0,0 C0.38,0.05 0.48,0.58 0.65,0.82 0.82,1 1,1 1,1');

const sequencia = document.querySelector('.sequencia-sobre');
const secoes = gsap.utils.toArray('.sobre');

// O bloco começa por cima da hero. As seções 2 e 3 ficam empilhadas sobre a 1ª, com fundo
// transparente, para as colunas de duas seções dividirem a mesma tela durante a troca.
// Sem JavaScript, as seções continuam uma abaixo da outra.
gsap.set(sequencia, { marginTop: -document.querySelector('.hero').offsetHeight });
gsap.set(secoes.slice(1), { position: 'absolute', top: 0, left: 0, width: '100%', backgroundColor: 'transparent' });
// Sem camada própria por seção, a foto de detalhe (z-index 1) fica acima das fotos principais
// de todas as seções, e a nova foto principal não a cobre durante a troca.
gsap.set(secoes, { zIndex: 'auto' });

const tl = gsap.timeline({
  defaults: { ease: easeTransicao, duration: 1 },
  scrollTrigger: {
    trigger: sequencia,
    start: 'top top',
    end: '+=550%',  // 5,5 unidades da linha do tempo = 5,5 telas de rolagem
    pin: true,
    scrub: 0.7,     // segue a rolagem com 0,7s de atraso (a duração da transição na referência)
  },
});

// Hero → Sobre Nós 1: a hero fica parada e escurece enquanto a "Sobre" sobe e a cobre.
tl.to('.conteudo-hero', { opacity: 0.4 }, 0)
  .fromTo(sequencia, { yPercent: 100 }, { yPercent: 0 }, 0);

// Sobre Nós 1 → 2 → 3: nada se desloca. As duas fotos novas são reveladas juntas, no lugar,
// de baixo para cima; os textos trocam por dissolução, com o novo surgindo antes de o
// antigo sumir. Meia tela de pausa antes de cada troca.
const partes = (secao) => [
  secao.querySelectorAll('.texto-sobre > :not(.frases-sobre)'), // título, rótulo e parágrafos
  secao.querySelector('.frases-sobre'),
  secao.querySelector('.foto-principal'),
  secao.querySelector('.foto-detalhe'),
];
const DURACAO = 1.5; // cada troca dura 1,5 tela; fotos e textos começam e terminam juntos
const FECHADA = 'inset(100% 0% 0% 0%)';
const ABERTA = 'inset(0% 0% 0% 0%)';

// As frases são iguais e estão no mesmo lugar em todas as seções: ficam paradas e só a
// da seção visível aparece (a troca entre elas é invisível).
gsap.set(secoes.slice(1).map((s) => s.querySelector('.frases-sobre')), { autoAlpha: 0 });

secoes.slice(1).forEach((nova, i) => {
  const inicio = 1.5 + i * (DURACAO + 0.5);
  const [texto, frases, foto, detalhe] = partes(secoes[i]);
  const [textoNovo, frasesNovas, fotoNova, detalheNovo] = partes(nova);

  tl.fromTo([fotoNova, detalheNovo], { clipPath: FECHADA }, { clipPath: ABERTA, duration: DURACAO }, inicio)
    .set([foto, detalhe], { autoAlpha: 0 }, inicio + DURACAO) // só depois que as novas cobrem tudo
    // Texto: dissolução delicada com 12px de movimento; o antigo quase some antes de o novo surgir.
    .to(texto, { autoAlpha: 0, y: -12, duration: DURACAO * 0.5, ease: 'sine.in' }, inicio)
    .fromTo(textoNovo, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: DURACAO * 0.55, ease: 'sine.out' }, inicio + DURACAO * 0.45)
    .set(frases, { autoAlpha: 0 }, inicio + DURACAO * 0.5)
    .set(frasesNovas, { autoAlpha: 1 }, inicio + DURACAO * 0.5);
});

tl.to({}, { duration: 0.5 }); // meia tela parada na última seção
