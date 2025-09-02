#!/bin/bash

echo "=== Testando API Node.js SQLite ==="
echo

# Testar cadastro de produto
echo "1. Cadastrando produto..."
curl -X POST http://localhost:3000/produtos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Notebook Dell","preco":2500.00,"estoque":5}' \
  -s | jq .
echo

# Testar cadastro de cliente
echo "2. Cadastrando cliente..."
curl -X POST http://localhost:3000/clientes \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@email.com"}' \
  -s | jq .
echo

# Listar produtos
echo "3. Listando produtos..."
curl http://localhost:3000/produtos -s | jq .
echo

# Listar clientes
echo "4. Listando clientes..."
curl http://localhost:3000/clientes -s | jq .
echo

echo "=== Testes concluídos ==="
