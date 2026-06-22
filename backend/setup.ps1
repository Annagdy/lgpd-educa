#!/usr/bin/env pwsh
# setup.ps1 - Script de setup para Windows PowerShell

Write-Host "Iniciando setup do backend LGPD-Educa..." -ForegroundColor Green
Write-Host ""

# 1. Iniciar Docker PostgreSQL
Write-Host "Iniciando PostgreSQL via Docker..." -ForegroundColor Blue
docker-compose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro ao iniciar Docker. Verifique se Docker Desktop esta aberto." -ForegroundColor Red
    exit 1
}

Write-Host "PostgreSQL iniciado!" -ForegroundColor Green
Write-Host ""

# 2. Aguardar PostgreSQL ficar pronto
Write-Host "Aguardando PostgreSQL ficar pronto..." -ForegroundColor Blue
Start-Sleep -Seconds 5

# 3. Criar banco de dados
Write-Host "Criando tabelas no banco de dados..." -ForegroundColor Blue
node setup-db.js

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro ao criar tabelas!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Setup completo!" -ForegroundColor Green
Write-Host ""
Write-Host "Proximas etapas:" -ForegroundColor Green
Write-Host "  1. npm install (se nao fez ainda)" -ForegroundColor Gray
Write-Host "  2. npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Acesse:" -ForegroundColor Green
Write-Host "  - Backend: http://localhost:3000" -ForegroundColor Gray
Write-Host "  - pgAdmin: http://localhost:8080" -ForegroundColor Gray
Write-Host "  - Email: admin" -ForegroundColor Gray
Write-Host "  - Senha: admin123" -ForegroundColor Gray
