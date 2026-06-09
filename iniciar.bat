@echo off
title Quiropraxia Roberto Venini - Servidor
echo ===================================================
echo Iniciando Servidor Web - Quiropraxia Roberto Venini
echo ===================================================
echo.
echo Por favor, espera un momento mientras se prepara todo la primera vez...
echo (Este proceso puede tardar unos minutos)
echo.
call "C:\Program Files\nodejs\npm.cmd" install
echo.
echo Listo! Levantando el servidor local...
echo La pagina se abrira automaticamente en tu navegador web.
echo.
start http://localhost:3000
call "C:\Program Files\nodejs\npm.cmd" run dev
pause
