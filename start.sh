#!/bin/bash

echo "🚀 Iniciando API Node.js SQLite com Arquitetura MVC"
echo "================================================="
echo

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    echo
fi

# Verificar se o banco de dados existe
if [ ! -f "database/database.sqlite" ]; then
    echo "🗄️  Criando banco de dados com dados de exemplo..."
    mkdir -p database
    
    # Iniciar a aplicação temporariamente para criar as tabelas
    timeout 5 npm start 2>/dev/null || true
    
    # Inserir dados de exemplo se o arquivo SQL existir
    if [ -f "database/seed-data.sql" ]; then
        sqlite3 database/database.sqlite < database/seed-data.sql 2>/dev/null || true
        echo "✅ Dados de exemplo inseridos"
    fi
    echo
fi

echo "🔧 Configuração concluída!"
echo "📍 API disponível em: http://localhost:3000"
echo "📚 Documentação: http://localhost:3000"
echo "🧪 Para testar: node test-mvc-api.js"
echo
echo "🏃‍♂️ Iniciando servidor..."
echo "================================================="

# Iniciar a aplicação
npm start
