# Projeto Final IF

Sistema de hotel revisado.

## Escopo atual

- Hóspedes
- Quartos e tipos de quartos
- Reservas
- Pagamentos e formas de pagamento
- Funcionários

Nesta versão, qualquer funcionário cadastrado pode executar todas as operações do sistema, inclusive cadastrar outros funcionários.

## Rodar o projeto

1. Ajuste a `CONNECTION_STRING` no arquivo `.env` ou `backend/.env`.
2. Instale as dependências:

```bash
npm install
```

3. Inicialize o banco:

```bash
npm run init-db
```

4. Inicie o backend:

```bash
npm start
```

5. Abra `frontend/index.html` no navegador.
