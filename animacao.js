// Transição da hero para a seção "Sobre", com a fluidez do demo do Codrops
// (async-page-transitions.crnacura.workers.dev): a hero fica parada e escurece
// sobre o fundo preto, enquanto a "Sobre" sobe de baixo para cima e a cobre.
gsap.registerPlugin(ScrollTrigger, CustomEase);

// Mesma curva de aceleração da referência: começa devagar, acelera e assenta suave.
const easeTransicao = CustomEase.create('transicao', 'M0,0 C0.38,0.05 0.48,0.58 0.65,0.82 0.82,1 1,1 1,1');

// Só a primeira "Sobre" participa da transição; as seguintes rolam normalmente.
const sobre = document.querySelector('.sobre');

// A "Sobre" passa a começar por cima da hero; a animação a empurra para baixo da tela.
// Sem JavaScript, ela continua subindo e cobrindo a hero como antes.
gsap.set(sobre, { marginTop: -document.querySelector('.hero').offsetHeight });

gsap.timeline({
  defaults: { ease: easeTransicao },
  scrollTrigger: {
    trigger: sobre,
    start: 'top top',
    end: '+=100%',  // a transição dura uma tela de rolagem
    pin: true,      // a subida da "Sobre" segue a curva acima, e não a rolagem direta
    scrub: 0.7,     // segue a rolagem com 0,7s de atraso (a duração da transição na referência)
  },
})
  .to('.conteudo-hero', { opacity: 0.4 }, 0)
  .fromTo(sobre, { yPercent: 100 }, { yPercent: 0 }, 0);
