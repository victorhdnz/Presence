# 🏠 Presence Imobiliária - Backend Completo

Sistema completo de backend para o site da Presence Consultoria Imobiliária, incluindo autenticação, gerenciamento de imóveis e notificações automáticas.

## 🚀 **Funcionalidades Implementadas**

### ✅ **Sistema de Autenticação**
- Registro e login de usuários
- Dois níveis de acesso: Cliente e Admin
- JWT para sessões seguras
- Middleware de proteção de rotas

### ✅ **Gerenciamento de Imóveis**
- Cadastro de imóveis pelos clientes
- Aprovação/rejeição pelos administradores
- Sistema completo de CRUD para admins
- Filtros avançados de busca
- Links compartilháveis

### ✅ **Painel Administrativo**
- Dashboard para corretoras (Helo e Vânia)
- Gerenciamento de usuários
- Aprovação de imóveis pendentes
- Estatísticas e relatórios

### ✅ **Sistema de Notificações**
- E-mails automáticos para corretoras
- Notificação de login de clientes
- Notificação de cadastro de imóveis
- Templates HTML profissionais

## 🛠️ **Instalação e Configuração**

### **1. Instalar Dependências**
```bash
npm install
```

### **2. Configurar Variáveis de Ambiente**

No Render, configure as seguintes variáveis:

```env
MONGODB_URI=sua_string_de_conexao_mongodb_aqui
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-app-gmail
FRONTEND_URL=https://seu-site.com
```

### **3. Criar Usuário Administrador**
```bash
npm run create-admin
```

**Credenciais padrão:**
- **E-mail:** admin@presence.com.br
- **Senha:** admin123456

⚠️ **IMPORTANTE:** Altere a senha após o primeiro login!

## 📁 **Estrutura do Projeto**

```
├── server.js              # Servidor principal
├── models/                # Modelos do MongoDB
│   ├── User.js           # Modelo de usuário
│   └── Property.js       # Modelo de imóvel
├── routes/                # Rotas da API
│   ├── auth.js           # Autenticação
│   └── properties.js     # Gerenciamento de imóveis
├── middleware/            # Middlewares
│   └── auth.js           # Autenticação e autorização
├── services/              # Serviços
│   └── emailService.js   # Notificações por e-mail
└── scripts/               # Scripts utilitários
    └── createAdmin.js     # Criação do usuário admin
```

## 🔌 **Endpoints da API**

### **Autenticação (`/api/auth`)**
- `POST /register` - Registro de usuário
- `POST /login` - Login
- `GET /profile` - Perfil do usuário (protegido)
- `PUT /profile` - Atualizar perfil (protegido)
- `GET /users` - Listar usuários (admin)
- `PATCH /users/:id/status` - Alterar status (admin)
- `PATCH /users/:id/promote` - Promover para admin (admin)

### **Imóveis (`/api/properties`)**
- `GET /` - Listar imóveis ativos (público)
- `GET /:id` - Obter imóvel específico (público)
- `POST /submit` - Cliente cadastrar imóvel (protegido)
- `POST /` - Admin criar imóvel (admin)
- `PUT /:id` - Atualizar imóvel (admin)
- `DELETE /:id` - Deletar imóvel (admin)
- `PATCH /:id/approve` - Aprovar/rejeitar (admin)
- `PATCH /:id/highlight` - Destacar imóvel (admin)
- `GET /admin/all` - Listar todos (admin)

## 🔐 **Sistema de Permissões**

### **Cliente (role: 'client')**
- ✅ Navegar no site
- ✅ Fazer login/registro
- ✅ Cadastrar imóveis para anúncio
- ✅ Ver perfil próprio

### **Admin (role: 'admin')**
- ✅ Todas as funcionalidades do cliente
- ✅ Acessar painel administrativo
- ✅ Gerenciar todos os imóveis
- ✅ Aprovar/rejeitar imóveis
- ✅ Gerenciar usuários
- ✅ Ver estatísticas

## 📧 **Sistema de Notificações**

### **E-mails Automáticos**
1. **Login de Cliente**
   - Destinatários: Helo e Vânia
   - Conteúdo: Nome, e-mail e horário do acesso

2. **Cadastro de Imóvel**
   - Destinatários: Helo e Vânia
   - Conteúdo: Dados do cliente e do imóvel

### **Configuração de E-mail**
- Serviço: Gmail
- Autenticação: OAuth2 ou senha de app
- Templates: HTML responsivo e profissional

## 🚀 **Deploy no Render**

### **Configurações**
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Environment:** Node.js 18+

### **Variáveis de Ambiente**
Configure todas as variáveis necessárias no dashboard do Render.

## 🧪 **Testes Locais**

### **1. Desenvolvimento**
```bash
npm run dev
```

### **2. Produção**
```bash
npm start
```

### **3. Criar Admin**
```bash
npm run create-admin
```

## 🔒 **Segurança**

- ✅ Senhas criptografadas com bcrypt
- ✅ JWT com expiração
- ✅ Rate limiting para prevenir spam
- ✅ Validação de dados
- ✅ Middleware de autenticação
- ✅ Controle de acesso baseado em roles

## 📱 **Próximos Passos**

### **Frontend Necessário**
1. **Página de Login/Registro**
2. **Dashboard Administrativo (/admin)**
3. **Formulário "Cadastre seu Imóvel"**
4. **Sistema de navegação baseado em roles**

### **Funcionalidades Adicionais**
1. **Upload de imagens** para imóveis
2. **Sistema de busca avançada**
3. **Relatórios e estatísticas**
4. **Notificações push**

## 🆘 **Suporte**

Para dúvidas ou problemas:
1. Verifique os logs do servidor
2. Confirme as variáveis de ambiente
3. Teste a conexão com o MongoDB
4. Verifique as permissões de usuário

---

**Desenvolvido para Presence Consultoria Imobiliária** 🏠✨
