# Como rodar o projeto completo (banco local de testes)

Pré-requisito: Docker Desktop aberto e Node instalado.

1. Banco (na pasta `backend`):
   `docker compose up -d`
   O banco `singlediamonds_teste` é criado na primeira vez, com a tabela `imagens` (ver `banco.sql`).
   Os dados ficam guardados no volume do Docker, então sobrevivem a reinicializações.
2. Dependências (só na primeira vez): `npm install`
3. Imagens (só na primeira vez, ou ao adicionar imagens novas em `IMG/` ou `IMG Menus/`): `npm run importar`
   As de `IMG/` são guardadas só pelo nome do arquivo; as de `IMG Menus/` pelo caminho (`IMG Menus/Magnata/6FA0380.jpg`), para nomes iguais em pastas diferentes não se misturarem.
   Imagens já importadas são puladas: o script só insere, nunca apaga nem sobrescreve.
4. Servidor: `npm start` e abrir http://127.0.0.1:3001
5. Conferir o banco: http://127.0.0.1:3001/api/teste (deve mostrar `conectado: true` e o total de imagens).

Para parar o banco: `docker compose stop`. Para apagar tudo e recomeçar: `docker compose down -v`.

## Credenciais
Ficam em `backend/.env` (fora do Git). Modelo, com valores de teste próprios:

    PGHOST=127.0.0.1
    PGPORT=5432
    PGDATABASE=singlediamonds_teste
    PGUSER=singled
    PGPASSWORD=<escolha uma senha>

Se o `.env` for perdido, crie outro e apague o volume (`docker compose down -v`) para o banco usar a nova senha.
Ao usar o banco do colega, basta trocar estes valores no `.env`.

## Publicar no Render + Neon
- Root Directory: a raiz do repositório (o servidor serve as páginas da pasta acima de `backend`).
- Build Command: `cd backend && npm install`. Start Command: `node backend/server.js`.
- Variáveis de ambiente: as do banco do Neon (`PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, ou `DATABASE_URL`) e `PGSSLMODE=require`. A porta vem do Render (`PORT`).
- Não defina `PERMITIR_UPLOAD`: o upload (`POST /api/imagens`) fica desligado. Localmente, `PERMITIR_UPLOAD=sim` no `.env` liga.
- Para enviar as imagens ao Neon, rode `npm run importar` na pasta `backend` com as variáveis do Neon no `.env` (ele só insere o que falta).
