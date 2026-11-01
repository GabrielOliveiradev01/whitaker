@echo off
chcp 65001 >nul
title Batalha das Rosas - TikTok Live
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js nao esta instalado.
  echo  Vou abrir o site: baixe a versao LTS, instale e depois rode este arquivo de novo.
  start "" https://nodejs.org
  pause
  exit /b
)
if not exist node_modules (
  echo  Instalando pela primeira vez, aguarde...
  call npm install --no-audit --no-fund
)
node server.js
pause
