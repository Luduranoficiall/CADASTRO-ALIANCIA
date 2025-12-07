#!/bin/bash
set -e

# Ativa venv se existir
if [ -f "venv/bin/activate" ]; then
  source venv/bin/activate
fi

# Instala dependências
pip install -r requirements.txt
pip install gunicorn

# Migrações Alembic (ignora se não existir)
if [ -d "alembic" ]; then
  alembic upgrade head || true
fi

# Inicia o app com Gunicorn/Uvicorn
exec gunicorn main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --timeout 120
