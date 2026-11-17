
require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');
const { Pool } = require('pg');

const banco = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD
});

const pasta = path.join(__dirname, '..', 'IMG');

const tipos = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

async function importar() {
  try {
    const arquivos = await fs.readdir(pasta);
    let salvas = 0;
    let existentes = 0;

    for (const nome of arquivos) {
      const tipo = tipos[path.extname(nome).toLowerCase()];
      if (!tipo) continue;

      const existe = await banco.query(
        'SELECT id FROM imagens WHERE nome = $1 LIMIT 1',
        [nome]
      );

      if (existe.rows.length > 0) {
        existentes++;
        continue;
      }

      const imagem = await fs.readFile(path.join(pasta, nome));

      await banco.query(
        'INSERT INTO imagens (nome, tipo_arquivo, imagem) VALUES ($1, $2, $3)',
        [nome, tipo, imagem]
      );

      console.log('Salva:', nome);
      salvas++;
    }

    console.log('Importação concluída!');
    console.log('Novas imagens:', salvas);
    console.log('Já existentes:', existentes);

  } catch (erro) {
    console.error('Erro:', erro.message);
  } finally {
    await banco.end();
  }
}

importar();
