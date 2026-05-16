# LGPD Educa — Third Branch

Plataforma educacional sobre a **Lei Geral de Proteção de Dados (LGPD)**, com sistema completo de autenticação, módulos de aprendizagem, quiz interativo e glossário.

> Continuação da [`second_branch`](https://github.com/Annagdy/lgpd-educa/tree/second_branch), integrando frontend e backend em um único projeto.

---

## 🛠 Tecnologias

### Frontend
- **React 18** + **Vite**
- **React Router DOM v6**
- **Lucide React** (ícones)
- CSS customizado com design system próprio (paleta roxa)

### Backend
- **Node.js** + **Express**
- **PostgreSQL** (via `pg`)
- **JWT** (autenticação)
- **bcryptjs** (hash de senhas)
- **Nodemailer** + **Mailtrap** (envio de e-mails)

---

## 📁 Estrutura do Projeto

```
lgpd-educa-third-branch/
├── src/                        # Frontend React
│   ├── context/
│   │   └── AuthContext.jsx     # Gerenciamento de autenticação JWT
│   ├── components/
│   │   └── PrivateRoute.jsx    # Proteção de rotas autenticadas
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ConfirmEmail.jsx
│   │   ├── Home.jsx            # Módulos de aprendizagem
│   │   ├── ModuleDetail.jsx    # Conteúdo de cada módulo
│   │   ├── Quiz.jsx            # Quiz interativo
│   │   └── Glossary.jsx        # Glossário com busca
│   ├── data/
│   │   └── modules.js          # Dados dos 6 módulos LGPD
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css               # Design system completo
├── backend/
│   ├── src/
│   │   ├── server.js           # Entrada do servidor Express
│   │   ├── config/
│   │   │   └── database.js     # Pool PostgreSQL
│   │   ├── routes/
│   │   │   └── authRoutes.js   # Rotas de autenticação
│   │   └── controllers/
│   │       └── authController.js
│   ├── database.sql            # Script de criação das tabelas
│   ├── .env.example            # Template de variáveis de ambiente
│   └── package.json
├── start.sh                    # Script para subir tudo de uma vez
├── package.json
└── README.md
```

---

## ⚙️ Pré-requisitos

- **Node.js** ≥ 18
- **PostgreSQL** (local ou Docker)
- Conta no **[Mailtrap](https://mailtrap.io)** (para capturar e-mails em dev)

---

## 🗄️ 1. Configurar o Banco de Dados

No **pgAdmin** ou `psql`, conecte ao banco `lgpd-educa` e execute:

```sql
-- backend/database.sql
CREATE TABLE IF NOT EXISTS users (
  id                  SERIAL PRIMARY KEY,
  username            VARCHAR(100) NOT NULL,
  email               VARCHAR(100) UNIQUE NOT NULL,
  password            VARCHAR(255) NOT NULL,
  is_verified         BOOLEAN DEFAULT FALSE,
  confirm_token       VARCHAR(255),
  reset_token         VARCHAR(255),
  reset_token_expires TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
```

> Se estiver usando Docker:
> ```bash
> docker run -d --name lgpd-postgres \
>   -e POSTGRES_USER=postgres \
>   -e POSTGRES_PASSWORD=pdsi_lgpd \
>   -e POSTGRES_DB=lgpd-educa \
>   -p 5432:5432 postgres:16
> ```

---

## 🔧 2. Configurar o Backend

```bash
cd backend
cp .env.example .env
```

Edite o arquivo `backend/.env`:

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=pdsi_lgpd
DB_NAME=lgpd-educa
DB_PORT=5432

PORT=3000

JWT_SECRET=sua_chave_secreta_aqui

EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=seu_usuario_mailtrap
EMAIL_PASS=sua_senha_mailtrap

FRONTEND_URL=http://localhost:5173
```

---

## 🚀 3. Rodar o Projeto

### Opção A — Script automático (recomendado)

```bash
./start.sh
```

Esse script instala dependências e sobe **frontend + backend** juntos.

### Opção B — Manualmente em terminais separados

**Terminal 1 — Backend:**
```bash
cd backend
npm install
npm run dev
# Servidor rodando em http://localhost:3000
```

**Terminal 2 — Frontend:**
```bash
npm install
npm run dev
# App rodando em http://localhost:5173
```

---

## 🔐 Fluxo de Autenticação

```
1. Registro   → POST /api/auth/register
               └─ Cria usuário + envia e-mail de confirmação via Mailtrap

2. Confirmação → GET /api/auth/confirm-email?token=xxx
               └─ Ativa a conta (is_verified = true)

3. Login      → POST /api/auth/login
               └─ Retorna JWT armazenado no localStorage

4. Acesso     → Rotas /,  /quiz, /glossario só acessíveis com JWT válido
               └─ Sem token → redireciona para /login

5. Recuperação → POST /api/auth/forgot-password
               └─ Envia link de redefinição para o e-mail
```

---

## 📚 Rotas da Aplicação

| Rota              | Acesso       | Descrição                        |
|-------------------|-------------|----------------------------------|
| `/login`          | Público     | Tela de login                    |
| `/register`       | Público     | Cadastro de novo usuário         |
| `/forgot-password`| Público     | Recuperação de senha             |
| `/confirm-email`  | Público     | Confirmação de e-mail via token  |
| `/`               | 🔒 Privado  | Módulos de aprendizagem          |
| `/quiz`           | 🔒 Privado  | Quiz interativo LGPD             |
| `/glossario`      | 🔒 Privado  | Glossário com busca              |

---

## 🌐 API Endpoints

| Método | Endpoint                          | Descrição                     |
|--------|-----------------------------------|-------------------------------|
| POST   | `/api/auth/register`              | Criar nova conta              |
| POST   | `/api/auth/login`                 | Autenticar usuário            |
| GET    | `/api/auth/confirm-email?token=`  | Confirmar e-mail              |
| POST   | `/api/auth/forgot-password`       | Solicitar redefinição de senha|
| GET    | `/health`                         | Health check do servidor      |

---

## 🌿 Branches

| Branch          | Descrição                                              |
|-----------------|--------------------------------------------------------|
| `main`          | Branch principal                                       |
| `second_branch` | Frontend React/TS + Backend Node.js (autenticação)     |
| `third_branch`  | ✅ **Esta branch** — integração completa, quiz, glossário e módulos expandidos |
