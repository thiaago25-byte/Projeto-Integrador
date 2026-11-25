
require('dotenv').config();

const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const path = require('path');

const app = express();

// SSL: ligado no Neon (host de fora) ou com PGSSLMODE=require; desligado no PostgreSQL local do Docker.
const local = ['127.0.0.1', 'localhost'].includes(process.env.PGHOST);
const usarSsl = process.env.PGSSLMODE === 'require' || !local;

// Local: variáveis PG* do .env. No Render/Neon: DATABASE_URL e/ou PGSSLMODE=require (o Neon exige SSL).
const banco = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: usarSsl,
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

// O upload fica desligado por padrão (o site publicado não pode receber arquivos de qualquer pessoa).
// Para usar localmente, coloque PERMITIR_UPLOAD=sim no .env. O importar.js não passa por aqui.
// Em produção (NODE_ENV=production) ele continua bloqueado mesmo com PERMITIR_UPLOAD.
function uploadLiberado(req, res, next) {
    if (process.env.NODE_ENV === 'production' || process.env.PERMITIR_UPLOAD !== 'sim') {
        return res.status(403).json({ erro: 'Envio de imagens desativado' });
    }
    next();
}

app.post('/api/imagens', uploadLiberado, upload.single('imagem'), async (req, res) => {
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


// Envia uma imagem do banco. O cache evita consultar o banco a cada visita.
async function enviarImagem(res, nome) {
    try {
        const resultado = await banco.query(
            'SELECT imagem, tipo_arquivo FROM imagens WHERE nome = $1 LIMIT 1',
            [nome]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).send('Imagem não encontrada');
        }

        const foto = resultado.rows[0];

        res.set('Content-Type', foto.tipo_arquivo);
        res.set('Cache-Control', 'public, max-age=86400');
        res.send(foto.imagem);

    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro ao carregar imagem');
    }
}

// Imagens antigas: o nome é só o do arquivo (ex.: /IMG/logo-SingleD.png)
app.get('/IMG/:nome', (req, res) => {
    enviarImagem(res, req.params.nome);
});

// Imagens das coleções: o nome no banco é o caminho (ex.: IMG Menus/Magnata/6FA0380.jpg)
app.get('/:pasta/:colecao/:nome', (req, res, next) => {
    if (req.params.pasta !== 'IMG Menus') return next();
    enviarImagem(res, `IMG Menus/${req.params.colecao}/${req.params.nome}`);
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
    'portfolio.js',
    'colecao.js',
    'magnata.html',
    'alta-joalheria.html',
    'mimos-para-animais.html',
    'noivado-e-casamento.html',
    'diamantes-naturais.html'
];

app.get('/', (req, res) => {
    res.sendFile(path.join(raiz, 'index.html'));
});

app.get('/:arquivo', (req, res, next) => {
    if (!arquivosPublicos.includes(req.params.arquivo)) return next();
    res.sendFile(path.join(raiz, req.params.arquivo));
});


// No Render a porta vem de PORT e o servidor precisa aceitar conexões de fora (0.0.0.0).
// Local: porta 3001, só neste computador.
const PORT = process.env.PORT || 3001;
const host = process.env.PORT ? '0.0.0.0' : '127.0.0.1';

app.listen(PORT, host, () => {
    console.log(`Servidor funcionando na porta ${PORT}!`);
});


