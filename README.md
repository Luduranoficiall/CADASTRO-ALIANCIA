# ALIANCI.A — Sistema Fullstack de Cadastro Multinível

Este repositório contém o sistema completo de cadastro multinível para ALIANCI.A, incluindo backend (FastAPI + SQLAlchemy + JWT) e frontend (Next.js 14 + Tailwind + Recharts), servidos juntos em uma única URL.


## Deploy Fly.io

1. Instale o [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/)
2. Faça login: `fly auth login`
3. Crie o app: `fly launch` (responda as perguntas)
4. Edite `fly.toml` e `.env` com suas chaves reais
5. Deploy: `fly deploy --remote-only`
6. Acesse a URL pública gerada pela Fly.io

## Execução local

1. **Clone o repositório:**
   ```bash
   git clone <url-do-seu-repositorio>
   cd aliancia_cadastro
   ```
2. **Crie e ative um ambiente virtual Python:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```
4. **Configure variáveis de ambiente:**
   - Edite o arquivo `.env` conforme necessário.
5. **Execute o servidor:**
   ```bash
   ./run.sh
   ```
6. **Acesse no navegador:**
   - [http://localhost:8000](http://localhost:8000)


## Segurança e Produção

- **Troque o ADMIN_TOKEN** no `.env` por um valor forte e secreto.
- **Configure o CORS** em `main.py` para aceitar apenas o domínio do seu frontend em produção.
- **Use senha forte no banco** e restrinja acesso apenas para IPs necessários.
- **Nunca exponha o banco diretamente para a internet** sem firewall.
- **Remova variáveis não utilizadas** do `.env` (ex: MP_TOKEN se não usar Mercado Pago).

## Onboarding rápido

1. Configure o banco PostgreSQL e o usuário:
   ```sql
   CREATE DATABASE aliancia_analytics;
   CREATE USER aliancia_user WITH PASSWORD 'sua-senha-forte';
   GRANT ALL PRIVILEGES ON DATABASE aliancia_analytics TO aliancia_user;
   ```
2. Ajuste o `.env`:
   ```
   DATABASE_URL=postgresql+psycopg2://aliancia_user:sua-senha-forte@SEU-HOST:5432/aliancia_analytics
   ADMIN_TOKEN=um-token-bem-forte
   ```
3. Siga os passos de deploy acima.

---

## Funcionalidades
- Cadastro multinível (3 níveis)
- Login/JWT
- Painel admin
- Relatórios (Recharts)
- Visualização de rede
- Reset de senha/token
- Upgrade/pagamento

---

Desenvolvido para ALIANCI.A — 2025
