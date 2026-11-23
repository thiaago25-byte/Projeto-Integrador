-- Tabela usada pelo server.js e pelo importar.js
CREATE TABLE IF NOT EXISTS imagens (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    tipo_arquivo TEXT NOT NULL,
    imagem BYTEA NOT NULL
);
