#!/bin/bash

# Script para subir as alterações para a branch second_branch

echo "🚀 Preparando para subir as alterações para 'second_branch'..."

# Adicionar todos os arquivos (respeitando o .gitignore)
git add .

# Criar o commit
echo "📝 Criando commit..."
git commit -m "feat: implementado backend de autenticação (cadastro e login)"

# Enviar para o repositório remoto
echo "📤 Enviando para o GitHub..."
git push origin second_branch

echo "✅ Sucesso! Suas alterações estão na branch second_branch."
