# LGPD Educa — five_branch

Branch de desenvolvimento com as seguintes implementações:

- ✅ **Quiz por módulo** — cada um dos 6 módulos tem 3 perguntas próprias com feedback imediato  
- ✅ **Correção da confirmação de e-mail** — JWT secret padronizado, verificação de conta reativada no login  
- ✅ **Correção da mensagem de cadastro** — substituído `alert()` por mensagens inline sem lag  

---

## Pré-requisitos

| Ferramenta | Versão mínima |
|------------|---------------|
| Node.js    | 18.x          |
| npm        | 9.x           |
| PostgreSQL  | 14.x (ou banco no Render) |

---

## 1. Clonar e entrar na branch

```bash
git clone https://github.com/Annagdy/lgpd-educa.git
cd lgpd-educa
git checkout five_branch
```

---

## 2. Configurar o Backend

### 2.1 Instalar dependências

```bash
cd backend
npm install
```

### 2.2 Criar o arquivo `.env`

Crie o arquivo `backend/.env` com as variáveis abaixo:

```env
# Banco de dados (Render PostgreSQL ou local)
DATABASE_URL=postgres://usuario:senha@host:5432/lgpd-educa

# JWT — use uma string longa e aleatória em produção
JWT_SECRET=fallback_secret_mude_no_render

# E-mail (Mailtrap para testes, Gmail ou outro para produção)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=587
EMAIL_USER=seu_usuario_mailtrap
EMAIL_PASS=sua_senha_mailtrap

# URL do frontend (usada no link de confirmação de e-mail)
FRONTEND_URL=http://localhost:5173

# Porta do servidor (opcional, padrão 3000)
PORT=3000
```

> **Dica — Mailtrap gratuito para testes:**  
> Crie uma conta em [mailtrap.io](https://mailtrap.io), copie as credenciais SMTP da sua inbox e cole aqui.

### 2.3 Configurar o banco de dados

#### Opção A — Banco local (PostgreSQL instalado)

```bash
# Criar o banco
createdb lgpd-educa

# Rodar o schema completo (se ainda não executado)
psql lgpd-educa < ../database/  # use o SQL da branch anterior

# Rodar a migration de quizzes por módulo
psql lgpd-educa -f migrations/001_module_quizzes.sql
```

#### Opção B — Banco no Render (já configurado)

Conecte via `psql` com a `DATABASE_URL` do painel do Render e rode apenas a migration:

```bash
psql "$DATABASE_URL" -f backend/migrations/001_module_quizzes.sql
```

> A migration é **idempotente**: pode ser rodada várias vezes sem duplicar dados.

### 2.4 Iniciar o servidor

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

O servidor sobe em **http://localhost:3000**

---

## 3. Configurar o Frontend

### 3.1 Instalar dependências

```bash
cd frontend
npm install
```

### 3.2 Criar o arquivo `.env`

Crie o arquivo `frontend/.env`:

```env
# URL do backend
VITE_API_URL=http://localhost:3000
```

> Em produção no Render, troque pelo URL do seu Web Service, ex:  
> `VITE_API_URL=https://lgpd-educa-backend.onrender.com`

### 3.3 Iniciar o frontend

```bash
npm run dev
```

O app abre em **http://localhost:5173**

---

## 4. Rodando os dois juntos

Abra **dois terminais**:

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

---

## 5. Fluxo de uso

```
Cadastro → E-mail de confirmação → Confirmar link → Login → Módulos → Quiz do Módulo
```

1. Acesse `/register` e crie uma conta  
2. Verifique o e-mail recebido (via Mailtrap ou caixa real)  
3. Clique no link de confirmação  
4. Faça login em `/login`  
5. Na home, clique em qualquer módulo  
6. Após ler o conteúdo, clique em **"Fazer quiz"** para testar o conhecimento  

---

## 6. Rodar os testes do backend

```bash
cd backend
npm test
```

---

## 7. Variáveis de ambiente — resumo rápido

| Variável       | Onde usar     | Descrição                              |
|----------------|---------------|----------------------------------------|
| `DATABASE_URL` | `backend/.env` | String de conexão PostgreSQL           |
| `JWT_SECRET`   | `backend/.env` | Chave secreta para tokens JWT          |
| `EMAIL_HOST`   | `backend/.env` | Servidor SMTP (ex: smtp.mailtrap.io)   |
| `EMAIL_PORT`   | `backend/.env` | Porta SMTP (geralmente 587)            |
| `EMAIL_USER`   | `backend/.env` | Usuário SMTP                           |
| `EMAIL_PASS`   | `backend/.env` | Senha SMTP                             |
| `FRONTEND_URL` | `backend/.env` | URL do frontend (para link no e-mail)  |
| `VITE_API_URL` | `frontend/.env`| URL do backend                         |

---

## 8. Estrutura dos arquivos alterados nesta branch

```
lgpd-educa/
├── backend/
│   ├── migrations/
│   │   └── 001_module_quizzes.sql        ← NOVO: quiz para cada módulo
│   └── src/
│       ├── controllers/
│       │   ├── authController.js         ← FIX: JWT secret + verificação de e-mail
│       │   └── contentController.js      ← NOVO: getModuleQuiz + realizarModuleQuiz
│       └── routes/
│           └── contentRoutes.js          ← NOVO: rotas /modules/:id/quiz
└── frontend/
    └── src/
        ├── pages/
        │   ├── ModuleDetail.tsx           ← NOVO: quiz inline por módulo
        │   └── Register.tsx              ← FIX: mensagem inline sem alert()
        └── index.css                     ← NOVO: estilos quiz e mensagens
```
