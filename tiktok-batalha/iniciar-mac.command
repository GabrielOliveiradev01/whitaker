#!/bin/bash
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js não está instalado. Baixe a versão LTS em https://nodejs.org, instale e rode este arquivo de novo."
  open https://nodejs.org
  read -n 1 -s -r -p "Pressione qualquer tecla para fechar"
  exit 1
fi
[ -d node_modules ] || { echo "Instalando pela primeira vez, aguarde..."; npm install --no-audit --no-fund; }
node server.js
