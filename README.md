# 💰 Controle Financeiro Pessoal

Sistema fullstack para gerenciamento de finanças pessoais — cadastro de receitas e despesas, categorias personalizáveis, dashboard com gráficos, filtros e exportação de dados.

🔗 **Aplicação no ar:** [financeiro-pessoal-kohl.vercel.app](https://financeiro-pessoal-kohl.vercel.app)

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)

</div>

---

## ✨ Funcionalidades

- 🔐 Autenticação de usuários com JWT e senhas criptografadas (bcrypt)
- 💸 CRUD completo de transações (receitas e despesas)
- 🏷️ Categorias personalizáveis, com 6 categorias padrão criadas automaticamente no cadastro
- 📊 Dashboard com resumo financeiro (receitas, despesas e saldo) e gráfico de despesas por categoria
- 🔍 Filtros por mês, categoria e tipo
- 📁 Exportação de transações em CSV
- 📄 Paginação da lista de transações
- 🌙 Modo escuro (dark mode)
- ✏️ Edição e exclusão de transações e categorias

## 🛠️ Tecnologias

**Backend**
- Node.js + Express (API REST)
- SQLite (via `better-sqlite3`)
- JWT para autenticação
- bcryptjs para hash de senhas

**Frontend**
- HTML, CSS e JavaScript puro (sem frameworks)
- Chart.js para visualização de dados

## 📂 Estrutura do projeto

```
financeiro-pessoal/
├── backend/
│   ├── server.js
│   ├── src/
│   │   ├── app.js
│   │   ├── config/          # conexão e schema do banco
│   │   ├── controllers/     # lógica das rotas
│   │   ├── middlewares/     # autenticação
│   │   ├── models/          # queries SQL
│   │   └── routes/          # definição das rotas
│   └── package.json
└── frontend/
    ├── login.html / register.html / dashboard.html
    ├── css/
    └── js/
```

## 🚀 Como rodar localmente

### Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend/` com:

```
PORT=3000
JWT_SECRET=sua-chave-secreta
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5500
```

```bash
npm run dev
```

O servidor cria o banco SQLite automaticamente na primeira execução.

### Frontend

Abra a pasta `frontend/` com a extensão **Live Server** do VS Code (ou qualquer servidor de arquivos estáticos), e acesse `login.html`.

## 🔑 Rotas da API

| Método | Rota                        | Descrição                        | Autenticado |
|--------|-----------------------------|-----------------------------------|:-----------:|
| POST   | `/api/auth/register`        | Cria uma nova conta                | ❌ |
| POST   | `/api/auth/login`           | Login e geração de token           | ❌ |
| GET    | `/api/categories`           | Lista categorias do usuário        | ✅ |
| POST   | `/api/categories`           | Cria uma categoria                 | ✅ |
| DELETE | `/api/categories/:id`       | Remove uma categoria               | ✅ |
| GET    | `/api/transactions`         | Lista transações (com filtros)     | ✅ |
| POST   | `/api/transactions`         | Cria uma transação                 | ✅ |
| PUT    | `/api/transactions/:id`     | Atualiza uma transação             | ✅ |
| DELETE | `/api/transactions/:id`     | Remove uma transação               | ✅ |
| GET    | `/api/transactions/summary` | Resumo (receitas, despesas, saldo) | ✅ |

## 📦 Deploy

- **Backend:** [Render](https://render.com)
- **Frontend:** [Vercel](https://vercel.com)

## 👤 Autor

**Luan Felipe**
[GitHub](https://github.com/luanfelipes7) · [LinkedIn](https://www.linkedin.com/in/luan-felipe-s7)
