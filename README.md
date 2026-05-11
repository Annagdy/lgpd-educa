# 🛡️ Sistema de Autenticação

Este é um sistema de aprendizado sobre a LGPD, com um fluxo completo de autenticação, incluindo registro de usuário, verificação de e-mail via Mailtrap e login seguro com JWT e PostgreSQL.

## 🚀 Tecnologias Utilizadas

* **Frontend:** React (Vite), TypeScript, Tailwind CSS, Framer Motion.
* **Backend:** Node.js, Express, JWT (Json Web Token).
* **Banco de Dados:** PostgreSQL (via Docker ou local).
* **Serviços:** Mailtrap (Teste de envio de e-mails).

---

## 🛠️ Passo a Passo para Configuração

### 1. Requisitos Prévios

* **Node.js** instalado.
* **Docker** instalado (para o banco de dados e pgAdmin).
* Uma conta no **Mailtrap** para capturar os e-mails de validação.

### 2. Configuração do Banco de Dados (PostgreSQL)

Se estiver usando Docker, certifique-se de que o container está rodando. No  **pgAdmin** , execute o seguinte script para criar a tabela correta:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE
);
```



### 3. Configuração do Backend

1. Navegue até a pasta `backend`.
2. Instale as dependências:

    ```bash
    npm install
    ```

3. Crie um arquivo **`.env`** na raiz da pasta `backend/` com as seguintes variáveis:

    ```bash
    DB_HOST=localhost
    DB_USER=postgres
    DB_PASSWORD=pdsi_lgpd
    DB_NAME=lgpd-educa
    DB_PORT=5432

    PORT=3000

    JWT_SECRET=sua_chave_secreta_aqui

    EMAIL_HOST=sandbox.smtp.mailtrap.io
    EMAIL_PORT=2525
    EMAIL_USER=seu_user_mailtrap
    EMAIL_PASS=seu_pass_mailtrap

    FRONTEND_URL=http://localhost:5173
    ```

4. Inicie o servidor:

    ```bash
    npm run dev
    ```


### 4. Configuração do Frontend

1. Navegue até a pasta `frontend`.
2. Instale as dependências:

    ```bash
    npm install
    ```

3. Inicie a aplicação:

    ```bash
    npm run dev
    ```

---

## 📧 Testando o Fluxo de Verificação

Para que testar o sistema, siga esta ordem:

1. **Registro:** Acesse `http://localhost:5173/register` e crie uma conta.
2. **E-mail:** O sistema enviará um link para o seu **Mailtrap** .
3. **Confirmação:** Clique no link no e-mail. Você será levado para a rota `/confirm-email` no React.
4. **Ativação:** O React fará um `fetch` automático para o Backend, mudando `is_email_verified` para `true` no banco de dados.
5. **Login:** Agora você pode fazer login em `http://localhost:5173/login`.
