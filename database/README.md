# 🗄️ Configuração do Banco de Dados

Instruções para subir o ambiente de banco de dados local usando Docker.

---

## 📋 Pré-requisitos

* [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e **aberto/rodando**

> ⚠️  **Windows** : o Docker Desktop requer WSL 2. O próprio instalador guia a ativação caso necessário.

---

## 📁 Estrutura da pasta

```
lgpd-educa/
└── database/
    ├── docker-compose.yml
    ├── init.sql
    ├── .env
    └── .env.example
```

---

## 🚀 Primeiros passos

### 1. Clone o repositório e entre na pasta do banco

```bash
cd lgpd-educa/database
```

### 2. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite se quiser mudar senhas (os padrões já funcionam para dev)
```

### 3. Suba os containers

```bash
docker compose up -d
```

### 4. Verifique se está rodando

```bash
docker compose ps
```

Você deve ver `lgpd_db` e `pgadmin` com status  **running** .

---

## 🔌 Conectando ao banco

### Via terminal (psql)

O comando abaixo entra no psql:

```bash
docker exec -it lgpd_db psql -U postgres -d lgpd-educa
```

Comandos úteis dentro do psql:

| Comando               | O que faz              |
| --------------------- | ---------------------- |
| `\dt`               | Lista todas as tabelas |
| `\d nome_da_tabela` | Detalha uma tabela     |
| `\q`                | Sai do psql            |

### Via pgAdmin (interface visual)

1. Abra **http://localhost:8080** no navegador
2. Login: `admin@pgadmin.org` / `admin123`
3. Clique em **Add New Server** e preencha:
   * Na aba ***'General*'**:
     * **Name** : lgpd-educa (qualquer nome)
   * Na aba ***'Connection'***:
     * **Host** : `lgpd_db`
     * **Port** : `5432`
     * **Mainetance Database** : `postgres`
     * **Username** : `postgres`
     * **Password** : `pdsi_lgpd`

---

## 🗂️ Tabelas criadas pelo `init.sql`

| Tabela        | Descrição                                                    |
| ------------- | -------------------------------------------------------------- |
| `usuarios`  | Contas dos usuários (login, cadastro, recuperação de senha) |
| `progresso` | Pontuação geral e módulos concluídos por usuário          |

---

## 🛑 Parar o ambiente

```bash
# Para os containers (mantém os dados)
docker compose stop

# Para E remove tudo, incluindo os dados do banco
docker compose down -v
```

---
