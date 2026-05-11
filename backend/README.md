# LGPD-Educa Backend

Este é o backend da aplicação LGPD-Educa, responsável pela autenticação e lógica de negócios.

## 🚀 Tecnologias
- **Node.js**
- **Express**
- **PostgreSQL** (pg)
- **JWT** (jsonwebtoken) para tokens de sessão
- **Bcryptjs** para criptografia de senhas
- **Cors** e **Dotenv**

## 📂 Estrutura de Pastas
- `src/config`: Configurações de banco de dados.
- `src/controllers`: Lógica das rotas (authController).
- `src/routes`: Definição dos endpoints.
- `src/server.js`: Ponto de entrada do servidor.
- `database/`: Scripts SQL para o banco.

## 🛠️ Instalação e Execução

1.  **Instalar dependências:**
    ```bash
    cd backend
    npm install
    ```

2.  **Configurar banco de dados:**
    - Crie um banco chamado `lgpd_educa` no PostgreSQL.
    - Execute o script em `database/schema.sql`.

3.  **Configurar variáveis de ambiente:**
    - Crie um arquivo `.env` na pasta `backend` baseando-se no `.env.example`.
    - Preencha com suas credenciais do PostgreSQL.

4.  **Iniciar o servidor:**
    - Para desenvolvimento (com recarregamento automático):
      ```bash
      npm run dev
      ```
    - Para produção:
      ```bash
      npm start
      ```

## 📋 Endpoints Principais

### Autenticação (`/api/auth`)

- **POST `/register`**: Cria um novo usuário.
  - Body: `{ "name": "...", "email": "...", "password": "..." }`
- **POST `/login`**: Autentica um usuário e retorna um token JWT.
  - Body: `{ "email": "...", "password": "..." }`
