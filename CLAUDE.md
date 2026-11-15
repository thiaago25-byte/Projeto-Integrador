# Single Diamonds — PI 4º período

Site institucional da joalheria **Single Diamonds** (marca ÈLOR), em HTML + CSS puros, construído a partir de um design no Figma.
Este arquivo resume o que já foi feito e serve de contexto para continuar o projeto com o Claude Code no terminal.

## Como trabalhar neste projeto

- Responda em **português**.
- Faça só o que foi pedido: **não** altere outros arquivos, **não** adicione animações nem funcionalidades novas sem pedido explícito.
- Quando o pedido for só analisar, **não** altere nenhum arquivo.
- Ao terminar, informe brevemente o que foi modificado e o que ainda difere do Figma.
- O objetivo é reproduzir fielmente o Figma: textos, imagens, fontes, cores, proporções e posições.

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Marcação da HERO (1ª e 2ª dobra) |
| `style.css` | Todos os estilos (tokens em `:root`) |
| `IMG/` | Imagens do site (inclui as de seções futuras) |

Repositório: `https://github.com/thiaago25-byte/Projeto-Integrador` (branch `main`). Todos os caminhos deste arquivo são relativos à raiz do repositório.

## Figma

- Arquivo: `https://www.figma.com/design/4fgdUf7S2Tdi6BswtU8wpA/` (ÈLOR - Single Diamonds), fileKey `4fgdUf7S2Tdi6BswtU8wpA`.
- Frames de referência na página "Page 1":
  - `HERO` (id `24:42`, 1440 × 1937): 1ª dobra (0–1024) + "Sobre Nós" (1024–1937).
  - `CORES` (`4:3`), `TIPOGRAFIA` (`8:10`), `IMAGENS` (`22:5`): guia visual.
  - `Sobre Nós` (`46:2`) e `Sobre Nós 2` (`66:23`): variações da seção "Sobre" ("Como fazemos?" e "Single Diamonds").
  - `Menu portfólio` (`116:2`): carrossel com Magnata, Alta Joalheria, Mimos para Animais, Noivado & Casamento (ainda não implementado).

## Identidade visual

- **Cores:** dourado `#BA9568`, branco principal `#F7F7F7`, cinza claro `#DDDDDD`, fundo escuro / texto `#333333`.
- **Fontes** (via Google Fonts no `<head>`):
  - Julius Sans One: títulos, rótulos, frases.
  - Jost Light (300): texto corrido.
- **Escala tipográfica:** título grande 36px, título principal 30px, título de seção 26px, texto padrão 14px, texto pequeno 10px. Na HERO: rótulo 16px, parágrafo 17px com entrelinha 1,75, frases 12px com espaçamento entre letras de 1,2px.

## O que já foi feito

### 1. Limpeza da exportação do Figma
- O HTML apontava para `styles.css`; o arquivo correto é `style.css`.
- Removidos: retângulo vazio, marcadores "Espaço 32/32/44", `<span>`s de cor, regras `flex-*` inúteis e um `@media` inválido aninhado.
- Classes renomeadas para nomes semânticos (`hero-dobra`, `cabecalho`, `sobre__titulo`…).
- `lang="pt-BR"`, título da aba "Single Diamonds".
- `@font-face` locais (pasta `fonts/` inexistente) trocados por Google Fonts.
- Corrigido o texto "ESSêNCIA" para "ESSÊNCIA".

### 2. 1ª dobra (`.hero-dobra`)
- Foto de fundo com `mix-blend-mode: darken`.
- Dois overlays com `multiply`:
  - **Vertical:** SVG exportado do Figma. Gradiente `#333`: 55% no topo, 0% entre 18% e 70%, 90% na base.
  - **Lateral:** gradiente em CSS, `#333` de 92% → 70% (38%) → 15% (62%) → 5%.
- Cabeçalho em x 51 / y 50:
  - Menu hambúrguer: 3 barras douradas de 19,6 × 2,917px.
  - Logo de 108 × 30, com o mesmo recorte do Figma.
- Título "SINGLE DIAMONDS" em Julius 36px branco, centralizado.

### 3. 2ª dobra (`.sobre`, 1440 × 913, fundo `#F7F7F7`)
- **Coluna de texto** em x 102, largura 495, topo em 132. Espaços entre os elementos:
  - título → rótulo: 40px;
  - rótulo → parágrafos e entre parágrafos: 16px;
  - último parágrafo → frases: 48px.
- O rótulo "QUEM SOMOS" tem uma linha dourada de 48px antes do texto.
- As frases ficam centralizadas na coluna, com sublinhado dourado de 228px.
- **Foto principal:** 600 × 560 em x 740 / y 128.
- **Foto de detalhe:** 201 × 248 em x 671 / y 530, sobreposta à principal, com borda branca de 10px feita via `::after`.

### 4. Imagens (pasta `IMG/`)
| Elemento | Arquivo |
|---|---|
| Fundo da 1ª dobra | `backhround home SingleD.jpg` (2048 × 1536) |
| Overlay vertical | `overlay vertical SingleD.svg` (exportado do Figma) |
| Logo | `logo-SingleD.png` (200 × 80) |
| Foto principal "Sobre" | `analise diamantes.jpg` (876 × 876) |
| Foto de detalhe "Sobre" | `alta joalheria background SingleD.png` (1024 × 1536) |

Ainda não usadas (seções futuras):
- **Fundos e fotos do Figma:** `casamento background`, `magnata background`, `mimo animais backhround home`, `diamantes naturais backhround home`, `criaçao diamantes`, `equipme Single-Diamonds-379-1000x600`, `Isaque e Joel SingleD`, `mayra e isaque`.
- **Banco de fotos de produtos e coleções** (para o portfólio): `alta-*`, `noivado-*`, `diamante-*`, `anel-solitario-1`, `pingente-gato-1`, `coleira`, `Design-sem-nome-*`, `3-mm*`, `IMG_*`, `WhatsApp-Image-*`, `Single-Diamonds-275-1`, `FEMININA`.
- **Ícone da marca:** `cropped-avatar.png` (512 × 512, pode servir de favicon).
- **Mesma foto com outro recorte:** `IMG_7374` (horizontal de `Design-sem-nome-3`), `WhatsApp-Image-2025-05-09-at-15.32.18` (original maior de `Isaque e Joel SingleD`) e `alta-1` (versão quadrada de `criaçao diamantes`).

Nos `src`, espaços são codificados como `%20`.

### 5. Efeito de sobreposição ao rolar (última mudança)
- A 1ª dobra passou a ter **1440 × 913**, a mesma altura da 2ª. Isso foi uma decisão do usuário e difere do Figma, onde ela tem 1024.
- A foto usa `object-fit: cover` com `object-position: center 66.5%`, para manter o anel logo abaixo do título.
- O título foi para `top: 437px`, para continuar centralizado.
- `.hero-dobra` tem `position: sticky; top: 0; z-index: 0`: fica parada enquanto a página rola.
- `.sobre` tem `position: relative; z-index: 1` e fundo opaco: sobe e cobre a 1ª dobra.
- Testado com Chrome headless em 1440 × 913: a 1ª dobra fica em top 0 até a 2ª cobri-la por completo.

## Diferenças conhecidas em relação ao Figma (pendentes)

1. **Moldura da foto de detalhe:** no Figma, a borda branca de 10px fica **por fora** da foto. A moldura mede cerca de 221 × 268 em x 661 / y 544, e a foto aparece inteira em 201 × 248. No site, a borda está **por dentro** e cobre 10px da imagem. O usuário ainda não pediu a correção.
2. **Desvio vertical:** parágrafos e frases ficam 3–4px acima do Figma, por arredondamento da entrelinha.
3. **Espaçamento entre letras dos títulos:** o título da HERO não tem; o título "Sobre" tem 0,36px. Isso vem do próprio Figma.
4. **Barra de rolagem:** com barra vertical, a área útil fica em cerca de 1425px, e o título da HERO desloca uns 7px.
5. **Telas menores:** o layout é fixo para 1440px; não há versão responsiva.

## Inconsistências no próprio Figma

- Camada `equipme Single-Diamonds-379-1000x600 1` vazia sob a foto principal.
- A foto de detalhe se chama "alta joalheria", mas mostra um anel com diamante amarelo em gota.
- A margem do cabeçalho (x 51) é diferente da margem do conteúdo (x 102).

## Como testar

- Abrir `index.html` direto no navegador, em uma janela de 1440px de largura.
- Comparação automatizada usada antes:
  - Renderizar a página com Chrome headless, a partir da raiz do repositório. Troque `chrome` pelo caminho do executável no seu sistema, por exemplo `"/c/Program Files/Google/Chrome/Application/chrome.exe"` no Git Bash do Windows:
    ```bash
    raiz=$(pwd -W 2>/dev/null || pwd)
    chrome --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=1440,1826 --screenshot=site.png "file:///${raiz#/}/index.html"
    ```
  - Comparar pixel a pixel com o screenshot do frame `24:42` exportado do Figma, usando Pillow.
  - O `--window-size` acima cobre a página atual (as duas dobras de 913px).
- Para testar o efeito de rolagem em headless, o screenshot com `window.scrollTo` não é confiável. Use uma cópia da página em que `html` tem `overflow: hidden` e `body` é o contêiner de rolagem (`body.scrollTop = N`).

## Próximos passos possíveis

- Corrigir a moldura da foto de detalhe (borda por fora).
- Implementar as próximas seções do Figma: "Sobre Nós" variações e "Menu portfólio".
- Versão responsiva, se for pedida.
