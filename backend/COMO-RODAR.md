# Como rodar o projeto completo (banco local de testes)

Pré-requisito: Docker Desktop aberto e Node instalado.

1. Banco (na pasta `backend`):
   `docker compose up -d`
   O banco `singlediamonds_teste` é criado na primeira vez, com a tabela `imagens` (ver `banco.sql`).
   Os dados ficam guardados no volume do Docker, então sobrevivem a reinicializações.
2. Dependências (só na primeira vez): `npm install`
3. Imagens (só na primeira vez, ou ao adicionar imagens novas em `IMG/`): `npm run importar`
   Imagens já importadas são puladas.
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
