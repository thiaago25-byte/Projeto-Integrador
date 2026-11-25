require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');
const { Pool } = require('pg');


// SSL: ligado no Neon (host de fora) ou com PGSSLMODE=require; desligado no PostgreSQL local do Docker.
const local = ['127.0.0.1', 'localhost'].includes(process.env.PGHOST);
const usarSsl = process.env.PGSSLMODE === 'require' || !local;

const banco = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: usarSsl,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
});

const raiz = path.join(__dirname, '..');

const tipos = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

let salvas = 0;
let existentes = 0;
let ignoradas = 0;

// Lê as páginas do site e junta os caminhos de imagem que elas usam
// (ex.: IMG/logo-SingleD.png e IMG%20Menus/Magnata/6FA0380.jpg).
async function imagensUsadas() {
  const usadas = new Set();

  // Páginas em Front-end/ e Front-end/Paginas-menu/; css/ e Animacoes/ (JavaScript) também podem citar imagens
  for (const pasta of ['Front-end', 'Front-end/Paginas-menu', 'css', 'Animacoes']) {
    const arquivos = await fs.readdir(path.join(raiz, pasta));

    for (const arquivo of arquivos) {
      if (!['.html', '.css', '.js'].includes(path.extname(arquivo))) continue;

      const texto = await fs.readFile(path.join(raiz, pasta, arquivo), 'utf-8');
      for (const [caminho] of texto.matchAll(/IMG(?:%20| )Menus\/[^"'()]+|IMG\/[^"'()]+/g)) {
        usadas.add(decodeURIComponent(caminho));
      }
    }
  }

  return usadas;
}

// Salva as imagens de uma pasta. "prefixo" é o começo do nome guardado no banco:
// '' para a pasta IMG (nome só do arquivo, como sempre foi) e 'IMG Menus/Magnata/' para as coleções.
async function importarPasta(pasta, prefixo, usadas) {
  const arquivos = await fs.readdir(pasta);

  for (const arquivo of arquivos) {
    const tipo = tipos[path.extname(arquivo).toLowerCase()];
    if (!tipo) continue;

    const nome = prefixo + arquivo;

    // Arquivos que nenhuma página usa continuam nas pastas, mas não vão para o banco
    const caminho = prefixo ? nome : 'IMG/' + nome;
    if (!usadas.has(caminho)) {
      ignoradas++;
      continue;
    }

    const existe = await banco.query(
      'SELECT id FROM imagens WHERE nome = $1 LIMIT 1',
      [nome]
    );

    if (existe.rows.length > 0) {
      existentes++;
      continue;
    }

    const imagem = await fs.readFile(path.join(pasta, arquivo));

    await banco.query(
      'INSERT INTO imagens (nome, tipo_arquivo, imagem) VALUES ($1, $2, $3)',
      [nome, tipo, imagem]
    );

    console.log('Salva:', nome);
    salvas++;
  }
}

async function importar() {
  try {
    const usadas = await imagensUsadas();

    await importarPasta(path.join(raiz, 'IMG'), '', usadas);

    // Uma subpasta por coleção dentro de IMG Menus
    const colecoes = await fs.readdir(path.join(raiz, 'IMG Menus'), { withFileTypes: true });
    for (const colecao of colecoes) {
      if (!colecao.isDirectory()) continue;
      await importarPasta(
        path.join(raiz, 'IMG Menus', colecao.name),
        `IMG Menus/${colecao.name}/`,
        usadas
      );
    }

    console.log('Importação concluída!');
    console.log('Novas imagens:', salvas);
    console.log('Já existentes:', existentes);
    console.log('Ignoradas (não usadas pelo site):', ignoradas);

  } catch (erro) {
    console.error('Erro:', erro.message);
  } finally {
    await banco.end();
  }
}

importar();
