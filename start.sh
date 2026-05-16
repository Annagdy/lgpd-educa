#!/bin/bash
# =====================================================
#  LGPD Educa - Third Branch - Script de Inicialização
# =====================================================

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$ROOT_DIR"
BACKEND_DIR="$ROOT_DIR/backend"

echo ""
echo "╔═══════════════════════════════════╗"
echo "║       LGPD Educa - Third Branch   ║"
echo "╚═══════════════════════════════════╝"
echo ""

# Verificar .env do backend
if [ ! -f "$BACKEND_DIR/.env" ]; then
  echo "⚠️  Arquivo backend/.env não encontrado!"
  echo "   Copiando .env.example como template..."
  cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
  echo "   ✅ Criado! Edite backend/.env com suas credenciais."
  echo ""
fi

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
cd "$FRONTEND_DIR"
npm install --silent
echo "   ✅ Frontend pronto!"

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd "$BACKEND_DIR"
npm install --silent
echo "   ✅ Backend pronto!"

echo ""
echo "🚀 Iniciando servidores..."
echo ""

# Iniciar backend em background
cd "$BACKEND_DIR"
npm run dev &
BACKEND_PID=$!
echo "   🔧 Backend iniciado (PID: $BACKEND_PID) → http://localhost:3000"

# Aguardar backend subir
sleep 2

# Iniciar frontend
cd "$FRONTEND_DIR"
echo "   🌐 Frontend iniciando → http://localhost:5173"
echo ""
echo "   Para parar: Ctrl+C"
echo ""
npm run dev

# Cleanup
kill $BACKEND_PID 2>/dev/null || true
