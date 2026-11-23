
require('dotenv').config();

const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const path = require('path');

const app = express();

const banco = new Pool({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD
});

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 15 * 1024 * 1024 }
});


app.get('/api/teste', async (req, res) => {
    try {
        const resultado = await banco.query(
            'SELECT COUNT(*) AS total FROM imagens'
        );

        res.json({
            conectado: true,
            imagens: Number(resultado.rows[0].total)
        });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro no banco' });
    }
});

app.post('/api/imagens', upload.single('imagem'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ erro: 'Envie uma imagem' });
        }

        const tipos = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp',
            '.gif': 'image/gif'
        };

        const extensao = path.extname(req.file.originalname).toLowerCase();
        const tipo = tipos[extensao];

        if (!tipo) {
            return res.status(400).json({ erro: 'Formato não permitido' });
        }

        const resultado = await banco.query(
            'INSERT INTO imagens (nome, tipo_arquivo, imagem) VALUES ($1, $2, $3) RETURNING id',
            [req.file.originalname, tipo, req.file.buffer]
        );

        res.json({
            mensagem: 'Imagem salva com sucesso!',
            id: resultado.rows[0].id
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao salvar imagem' });
    }
});


app.get('/api/imagens/:id', async (req, res) => {
    try {
        const resultado = await banco.query(
            'SELECT imagem, tipo_arquivo FROM imagens WHERE id = $1',
            [req.params.id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).send('Imagem não encontrada');
        }

        const foto = resultado.rows[0];

        res.set('Content-Type', foto.tipo_arquivo);
        res.send(foto.imagem);

    } catch (erro) {
        res.status(500).send('Erro ao carregar imagem');
    }
});

app.use((erro, req, res, next) => {
    res.status(400).json({ erro: erro.message });
});


app.get('/IMG/:nome', async (req, res) => {
    try {
        const resultado = await banco.query(
            'SELECT imagem, tipo_arquivo FROM imagens WHERE nome = $1 LIMIT 1',
            [req.params.nome]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).send('Imagem não encontrada');
        }

        const foto = resultado.rows[0];

        res.set('Content-Type', foto.tipo_arquivo);
        res.send(foto.imagem);

    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao carregar imagem');
    }
});

// Abrir o site pelo servidor Node.js
// Só os arquivos públicos do site são servidos (nada de .env, CLAUDE.md, .claude ou backend)
const raiz = path.join(__dirname, '..');
const arquivosPublicos = [
    'index.html',
    'portfolio.html',
    'style.css',
    'menu.js',
    'hero.js',
    'portfolio.js'
];

app.get('/', (req, res) => {
    res.sendFile(path.join(raiz, 'index.html'));
});

app.get('/:arquivo', (req, res, next) => {
    if (!arquivosPublicos.includes(req.params.arquivo)) return next();
    res.sendFile(path.join(raiz, req.params.arquivo));
});


app.listen(3001, '127.0.0.1', () => {
    console.log('Servidor funcionando na porta 3001!');
});

