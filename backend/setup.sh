#!/bin/bash
# setup.sh - Script de setup para Mac/Linux

echo "🚀 Iniciando setup do backend LGPD-Educa..."
echo ""

# 1. Iniciar Docker PostgreSQL
echo "📦 Iniciando PostgreSQL via Docker..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Erro ao iniciar Docker. Verifique se Docker Desktop está aberto."
    exit 1
fi

echo "✅ PostgreSQL iniciado!"
echo ""

# 2. Aguardar PostgreSQL ficar pronto
echo "⏳ Aguardando PostgreSQL ficar pronto..."
sleep 5

# 3. Criar banco de dados
echo "🗄️  Criando tabelas no banco de dados..."
node setup-db.js

if [ $? -ne 0 ]; then
    echo "❌ Erro ao criar tabelas!"
    exit 1
fi

echo ""
echo "✅ Setup completo!"
echo ""
echo "📝 Próximas etapas:"
echo "  1. npm install (se não fez ainda)"
echo "  2. npm run dev"
echo ""
echo "🌐 Acesse:"
echo "  - Backend: http://localhost:3000"
echo "  - pgAdmin: http://localhost:8080 (admin@pgadmin.org / admin123)"
