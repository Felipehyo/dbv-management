# Documentação - Virtual Minutes (Ata Virtual)

## 📋 Visão Geral

A funcionalidade de **Ata Virtual** foi repaginada e implementada seguindo os padrões do projeto. O sistema permite o registro de atas de secretaria e capelania com vinculação automática à unidade do usuário logado.

## 🏗️ Estrutura de Pastas

```
src/pages/VirtualMinutes/
├── index.js              # Página inicial (menu com 3 opções)
├── Secretaria.js         # Página de registro de ata de secretaria
├── Capelania.js          # Página de registro de ata de capelania
├── Historico.js          # Página de histórico de atas
└── style.scss            # Estilos compartilhados
```

## 📄 Páginas Implementadas

### 1️⃣ Página Inicial - `/virtual-minutes`
**Arquivo:** `index.js`

Exibe um menu com 3 opções:
- **📝 Ata da Secretaria** - Acesso ao formulário de secretaria
- **🙏 Ata da Capelania** - Acesso ao formulário de capelania
- **📚 Histórico de Atas** - Visualização do histórico

**Características:**
- Identifica automaticamente o usuário logado via `sessionStorage.getItem('id')`
- Busca a unidade vinculada ao usuário
- Exibe o logo da unidade (se disponível)
- Armazena `unitId` no sessionStorage para uso nas próximas páginas

---

### 2️⃣ Página de Ata da Secretaria - `/virtual-minutes/secretaria`
**Arquivo:** `Secretaria.js`

Formulário para registrar ata da secretaria com upload de imagens.

**Campos:**
- **Data da Ata** (input date) - Obrigatório
- **Descrição** (textarea) - Obrigatório, 6 linhas
- **Fotos** (upload) - Até 3 imagens, opcional

**Funcionalidades:**
- Limite de 3 imagens com validação
- Possibilidade de remover imagens antes de enviar
- Pré-visualização das imagens selecionadas
- Envio via `multipart/form-data`

**API Utilizada:**
```
POST /virtual-minutes/secretaria?unitId={unitId}&userId={userId}
```

---

### 3️⃣ Página de Ata da Capelania - `/virtual-minutes/capelania`
**Arquivo:** `Capelania.js`

Formulário para registrar ata da capelania (texto apenas).

**Campos:**
- **Data da Ata** (input date) - Obrigatório
- **Descrição** (textarea) - Obrigatório, 8 linhas

**Funcionalidades:**
- Interface simples e direta
- Envio via `application/json`

**API Utilizada:**
```
POST /virtual-minutes/capelania?unitId={unitId}&userId={userId}
```

---

### 4️⃣ Página de Histórico - `/virtual-minutes/historico`
**Arquivo:** `Historico.js`

Exibição de todas as atas registradas da unidade, organizadas por data.

**Funcionalidades:**
- Agrupa atas por data em ordem decrescente
- Exibe tipo de ata (Secretaria ou Capelania)
- Mostra autor e data de criação
- Exibe imagens (clicável para ampliar)
- **Somente leitura** - sem edição ou deleção
- Modal para ampliar imagens

**API Utilizada:**
```
GET /virtual-minutes/by-period?unitId={unitId}&initialDate={date}&finalDate={date}
```

---

## 🔄 Fluxo de Navegação

```
Home (/home)
  ↓
Virtual Minutes (/virtual-minutes)
  ├─→ Secretaria (/virtual-minutes/secretaria)
  │   └─→ [Registra] → [Volta para Virtual Minutes]
  ├─→ Capelania (/virtual-minutes/capelania)
  │   └─→ [Registra] → [Volta para Virtual Minutes]
  └─→ Histórico (/virtual-minutes/historico)
      └─→ [Visualiza] → [Volta para Virtual Minutes]
```

---

## 🎨 Padrões Utilizados

### Validação de Formulários
```javascript
// Mesmo padrão usado em CashBookRegister e EventRegister
let valid = true;
let errors = [];

if (campo === '' || campo === null) {
  setFieldValid(true);
  errors.push('campo');
  valid = false;
}

// Tratamento de erro com mensagem customizada
```

### Chamadas à API
```javascript
// Mesmo padrão de api.js centralizado
api.post('/endpoint?param=value', data, {
  headers: { 'Content-Type': 'application/json' }
}).then(response => {
  // Sucesso
}).catch(error => {
  const errorMsg = error.response?.data?.details || 'Erro padrão';
});
```

### Gestão de Estado
```javascript
// useState para campos de formulário
const [description, setDescription] = useState('');
const [open, setOpen] = useState(false);
const [alertMessage, setAlertMessage] = useState('');
const [severity, setSeverity] = useState('success');
```

### Alerts com Snackbar + Alert (Material-UI)
```jsx
<Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
  <Alert severity={severity} variant="filled">
    {alertMessage}
  </Alert>
</Snackbar>
```

---

## 📦 Dependências Utilizadas

- **Material-UI**: `@mui/material`, `@mui/icons-material`
- **React Router**: `useNavigate`
- **Axios**: Para chamadas à API

---

## 🚀 Rotas Adicionadas

**Em `src/routes.js`:**

```javascript
// Imports
import VirtualMinutes from "./pages/VirtualMinutes";
import VirtualMinutesSecretaria from "./pages/VirtualMinutes/Secretaria";
import VirtualMinutesCapelania from "./pages/VirtualMinutes/Capelania";
import VirtualMinutesHistorico from "./pages/VirtualMinutes/Historico";

// Routes (dentro de PrivateRoute)
<Route path='/virtual-minutes' exact element={<VirtualMinutes/>}/>
<Route path='/virtual-minutes/secretaria' exact element={<VirtualMinutesSecretaria/>}/>
<Route path='/virtual-minutes/capelania' exact element={<VirtualMinutesCapelania/>}/>
<Route path='/virtual-minutes/historico' exact element={<VirtualMinutesHistorico/>}/>
```

---

## 🏠 Adição à Home

**Em `src/pages/Home/index.js`:**

```javascript
{
  title: 'Ata Virtual',
  description: 'Registrar atas de secretaria, capelania e visualizar histórico',
  icon: 'https://cdn-icons-png.flaticon.com/512/2913/2913091.png',
  route: '/virtual-minutes',
}
```

---

## 🔐 Autenticação

O sistema utiliza `sessionStorage` para armazenar dados do usuário:

- **id** - ID do usuário logado
- **unitId** - ID da unidade (buscado automaticamente)
- **virtualMinutesUnitId** - ID da unidade para contexto da ata virtual

---

## 📱 Responsividade

Todos os componentes seguem a estrutura responsiva do projeto:
- Container máximo de **420px**
- Altura mínima de **100svh** (100% da viewport)
- Padding consistente de **16px**
- Flexbox para layouts flexíveis

---

## ✅ Checklist de Requisitos

- ✅ Página inicial com 3 opções (Secretaria, Capelania, Histórico)
- ✅ Página de Secretaria com upload até 3 imagens
- ✅ Página de Capelania com texto apenas
- ✅ Página de Histórico com visualização apenas (sem edição/deleção)
- ✅ Identificação automática do usuário logado
- ✅ Busca e exibição do logo da unidade
- ✅ Vinculação automática à unidade do usuário
- ✅ Integração com API backend
- ✅ Validação de formulários
- ✅ Alerts e feedback ao usuário
- ✅ Navegação fluida entre páginas
- ✅ Seguimento do padrão do projeto

---

## 🔧 Como Adicionar Novas Features

Seguindo o padrão estabelecido:

1. Criar pasta em `src/pages/NovaFeature/`
2. Arquivo `index.js` com componente principal
3. Arquivo `style.scss` com estilos
4. Importar em `routes.js` e adicionar rotas
5. Adicionar à Home se necessário
6. Seguir padrão de validação, API e alerts

---

## 📝 Notas

- As atas de secretaria podem ter até 3 fotos (máximo da API)
- As atas de capelania não suportam fotos
- As atas são somente leitura no histórico
- A deleção e edição não são permitidas no histórico (conforme requisito)
- Todas as datas seguem formato `YYYY-MM-DD`

