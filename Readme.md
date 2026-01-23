# 🧾 Projeto Cheque API

API desenvolvida para controle e gerenciamento de cheques recebidos por um mercado.

## 🚀 Tecnologias utilizadas
- Node.js
- Express
- MySQL
- JWT (JSON Web Token)
- bcrypt
- Nodemon

## 📌 Funcionalidades

### 🔐 Autenticação
- Login com JWT
- Proteção de rotas com middleware

### 👤 Usuários
- Cadastro de usuários (somente gerente)
- Atualização de usuário (gerente)
- Exclusão de usuário (gerente)
- Controle de status (ativo/inativo)
- Controle de tipo (gerente / usuário)

### 💳 Cheques
- Criar cheque
- Listar cheques
- Editar cheque (gerente)
- Atualizar status do cheque com regras
- Deletar cheque (gerente)

### 🔄 Regras de negócio
- Usuários visualizam todos os cheques
- Gerente possui controle total
- Status do cheque segue fluxo:
  - recebido → guardado → depositado

## 🧱 Arquitetura
O projeto segue o padrão:
- **Routes**: definição das rotas
- **Controllers**: tratamento das requisições
- **Services**: regras de negócio
- **Middlewares**: autenticação e autorização

## ▶️ Como executar o projeto

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/projeto-cheque

npm install

JWT_KEY=sua_chave_secreta
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=senha
DB_NAME=projetoCheque

npm run dev