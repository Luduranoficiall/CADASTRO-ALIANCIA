# 🚀 ALIANCIA - Sistema de Cadastro e Indicações

Sistema completo de cadastro com rede de indicações multinível, pagamentos via PIX e painel administrativo.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)

## ✨ Funcionalidades

### 👤 Usuário
- ✅ Cadastro com link de indicação
- ✅ Login seguro com JWT
- ✅ Painel com estatísticas de rede (Nível 1, 2, 3)
- ✅ Visualização da rede de indicados (árvore visual)
- ✅ Extrato financeiro detalhado
- ✅ Pagamento via PIX com upload de comprovante
- ✅ Perfil editável
- ✅ Recuperação de senha

### 👨‍💼 Administrador
- ✅ Dashboard com métricas em tempo real
- ✅ Gestão completa de membros
- ✅ Aprovação de pagamentos
- ✅ Relatórios exportáveis (CSV)
- ✅ Ranking de indicações

### 🔐 Segurança
- ✅ Criptografia AES-256 para dados sensíveis (CPF, telefone)
- ✅ JWT para autenticação
- ✅ CORS configurado
- ✅ Headers de segurança
- ✅ Senhas com hash bcrypt

## 🛠️ Tecnologias

### Backend
- **FastAPI** - Framework Python moderno e rápido
- **SQLAlchemy** - ORM para banco de dados
- **Alembic** - Migrações de banco
- **JWT** - Autenticação segura
- **Cryptography** - Criptografia AES-256
- **Pydantic** - Validação de dados

### Frontend
- **Next.js 14** - React framework com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **Glass Morphism** - Design premium moderno

## 📦 Instalação

### Requisitos
- Python 3.10+
- Node.js 18+
- npm ou yarn

### Backend

```bash
# Clone o repositório
git clone https://github.com/Luduranoficiall/CADASTRO-ALIANCIA.git
cd CADASTRO-ALIANCIA

# Crie ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou: venv\Scripts\activate  # Windows

# Instale dependências
pip install -r requirements.txt

# Configure variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Execute migrações
alembic upgrade head

# Inicie o servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend

# Instale dependências
npm install

# Inicie em desenvolvimento
npm run dev

# Ou faça build para produção
npm run build
npm start
```

## 🌐 Endpoints da API

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/register` | Cadastrar novo usuário |
| POST | `/token` | Login (obter token) |
| GET | `/me` | Dados do usuário logado |

### Usuário
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/painel` | Estatísticas do painel |
| GET | `/rede/{id}` | Rede de indicados |
| GET | `/extrato` | Extrato financeiro |
| POST | `/pagar` | Registrar pagamento |
| PUT | `/perfil` | Atualizar perfil |

### Admin
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/admin/membros` | Listar membros |
| GET | `/admin/relatorios` | Relatórios |
| PUT | `/admin/aprovar/{id}` | Aprovar pagamento |
| DELETE | `/admin/membro/{id}` | Excluir membro |

## 📁 Estrutura do Projeto

```
CADASTRO-ALIANCIA/
├── main.py              # API FastAPI principal
├── models.py            # Modelos SQLAlchemy
├── schemas.py           # Schemas Pydantic
├── crud.py              # Operações de banco
├── auth.py              # Autenticação JWT
├── crypto_utils.py      # Criptografia AES-256
├── database.py          # Configuração do banco
├── requirements.txt     # Dependências Python
├── Dockerfile           # Container Docker
├── fly.toml             # Deploy Fly.io
├── alembic/             # Migrações
│
└── frontend/            # Next.js App
    ├── src/
    │   ├── app/         # Páginas (App Router)
    │   │   ├── login/
    │   │   ├── cadastro/
    │   │   ├── painel/
    │   │   ├── admin/
    │   │   ├── extrato/
    │   │   ├── pagar/
    │   │   ├── perfil/
    │   │   ├── ranking/
    │   │   └── ...
    │   ├── components/  # Componentes React
    │   └── lib/         # Utilitários
    └── public/          # Assets estáticos
```

## 🚀 Deploy

### Fly.io (Backend)
```bash
fly auth login
fly launch
fly deploy
```

### Vercel (Frontend)
```bash
cd frontend
vercel
```

## 🎨 Design Premium

O frontend utiliza um design **Glass Morphism** moderno:
- 🌙 Tema escuro (#0a0a0a, #1a1a1a)
- 🪟 Efeitos de vidro com blur
- ✨ Gradientes dourado/âmbar
- 🎬 Animações suaves CSS
- 📱 100% responsivo (mobile-first)

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados.

## 👨‍💻 Autor

**Extraordinária AI** - Desenvolvimento de soluções inteligentes

---

⭐ Se este projeto te ajudou, deixe uma estrela!
