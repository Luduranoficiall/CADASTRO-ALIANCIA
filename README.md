# 🚀 ALIANCIA - Sistema de Cadastro e Indicações

<div align="center">

![ALIANCIA Logo](https://img.shields.io/badge/ALIANCIA-Sistema%20Multinível-gold?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyIDJMMiAyMmgyMEwxMiAyeiIvPjwvc3ZnPg==)

**Sistema completo de cadastro com rede de indicações multinível, pagamentos via PIX e painel administrativo.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python)](https://python.org/)
[![License](https://img.shields.io/badge/License-Proprietário-red?style=flat-square)](LICENSE)

[🌐 Site do Desenvolvedor](https://www.luduranoficiall.com) • [📱 WhatsApp](https://wa.me/5512996182268) • [💼 LinkedIn](https://linkedin.com/in/luduranoficiall)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#️-tecnologias)
- [Instalação](#-instalação)
- [API Endpoints](#-endpoints-da-api)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Deploy](#-deploy)
- [Screenshots](#-screenshots)
- [Autor](#-autor)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **ALIANCIA** é um sistema profissional de cadastro multinível desenvolvido com as tecnologias mais modernas do mercado. Oferece uma experiência completa para gestão de redes de indicação, com painel administrativo robusto, integração com PIX para pagamentos e design premium responsivo.

### 🌟 Destaques
- **Performance**: Backend em FastAPI (um dos frameworks mais rápidos)
- **Segurança**: Criptografia AES-256 + JWT + bcrypt
- **Design**: Interface moderna com Glass Morphism
- **Escalabilidade**: Arquitetura preparada para milhares de usuários
- **Mobile-First**: 100% responsivo

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

## 📸 Screenshots

<div align="center">

| Login | Painel | Admin |
|:-----:|:------:|:-----:|
| Glass Morphism | Estatísticas | Gestão de Membros |

| Cadastro | Extrato | Ranking |
|:--------:|:-------:|:-------:|
| 3 Etapas | Financeiro | Top Indicadores |

</div>

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
# Segurança
SECRET_KEY=sua_chave_secreta_min_32_chars
FERNET_KEY=sua_chave_fernet_base64

# Banco de Dados
DATABASE_URL=sqlite:///./aliancia.db

# JWT
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256

# PIX
PIX_KEY=sua_chave_pix
PIX_NOME=Nome Recebedor
```

## 🤝 Contribuição

Este é um projeto proprietário. Para contribuições ou parcerias comerciais, entre em contato.

## 📄 Licença

Este projeto é **proprietário**. Todos os direitos reservados.

**© 2025 Ludurano Oficial. Todos os direitos reservados.**

---

## 👨‍💻 Autor

<div align="center">

<img src="https://github.com/Luduranoficiall.png" width="120" style="border-radius: 50%;" alt="Ludurano Oficial"/>

### **Ludurano Oficial**

*Desenvolvedor Full Stack | Especialista em Sistemas Web*

[![Website](https://img.shields.io/badge/🌐_Website-www.luduranoficiall.com-gold?style=for-the-badge)](https://www.luduranoficiall.com)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-+55_12_99618--2268-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/5512996182268)
[![GitHub](https://img.shields.io/badge/GitHub-Luduranoficiall-181717?style=for-the-badge&logo=github)](https://github.com/Luduranoficiall)

</div>

---

<div align="center">

**Desenvolvido com ❤️ por [Ludurano Oficial](https://www.luduranoficiall.com)**

⭐ **Se este projeto te ajudou, deixe uma estrela!** ⭐

![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=flat-square)
![Brazil](https://img.shields.io/badge/Made%20in-Brazil%20🇧🇷-green?style=flat-square)

</div>
