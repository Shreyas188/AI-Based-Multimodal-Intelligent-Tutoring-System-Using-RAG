@echo off
title Offline Physics Tutor Starter
echo ==================================================
echo   Starting Offline Physics Tutor (Smart Prep)...
echo ==================================================

:: 1. Apply CPU-only variables locally
set CUDA_VISIBLE_DEVICES=-1
set OLLAMA_VULKAN=0
set OLLAMA_LLM_LIBRARY=cpu_avx2

:: 2. Terminate running instances to prevent port bind conflicts
echo Cleaning up existing instances...
taskkill /f /im ollama.exe >nul 2>&1
taskkill /f /im "ollama app.exe" >nul 2>&1
taskkill /f /im node.exe >nul 2>&1

:: 3. Launch Ollama in CPU mode
echo Starting Ollama (CPU mode)...
start /min "Ollama Server" cmd /c "ollama serve"

:: Wait 3 seconds for Ollama to boot up
ping 127.0.0.1 -n 4 >nul

:: 4. Start FastAPI Backend
echo Starting FastAPI Backend...
cd /d "%~dp0backend"
start /min "FastAPI Backend" cmd /c "venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 8000"

:: Wait 2 seconds for Backend to start
ping 127.0.0.1 -n 3 >nul

:: 5. Open Web Pages in Default Browser
echo Launching Tutor application in browser...
start http://localhost:5173/
start http://localhost:5173/admin.html

:: 6. Start React + Vite Frontend in active terminal
echo Starting React + Vite Frontend...
cd /d "%~dp0frontend"
cmd /c "npm run dev"
