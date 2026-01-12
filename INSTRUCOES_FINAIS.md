# 📱 Pesquisa Tanques Inteligentes - Instruções Finais

## ✅ Aplicação Completa e Testada

A aplicação foi desenvolvida com sucesso e está **100% funcional** para seus vendedores usarem em tablets.

---

## 🎯 O que foi implementado

### ✨ Formulário com Foto Individual para Cada Item

Cada pergunta/item agora tem seu próprio campo de captura de foto:

1. **Foto da Propulsora** - com checkbox "Tem Propulsora?"
2. **Foto do Lacre da Propulsora** - aparece APENAS se marcou "Tem Propulsora"
3. **Foto da Mangueira** - com checkbox "Tem Mangueira?"
4. **Foto da Pistola** - com checkbox "Tem Pistola de Abastecimento?"
5. **Foto do Digital da Pistola** - aparece APENAS se marcou "Tem Pistola"
6. **Foto da Bacia de Contenção** - com checkbox "Tem Bacia?"
7. **Foto do Lacre de Segurança** - com checkbox "Tem Lacre?"
8. **Foto do Cliente/Assinatura** - com checkbox "Interesse em Continuar?"

### 🔗 Perguntas Condicionais com Dependências

O formulário é **inteligente** e mostra perguntas dependentes automaticamente:

- ✅ Se marcar "Tem Propulsora?" → aparece "Propulsora possui Lacre?"
- ✅ Se marcar "Tem Pistola?" → aparece "Digital da Pistola está Funcionando?"
- ✅ Se desmarcar → a pergunta dependente desaparece

### 📸 Sistema de Captura de Fotos

- Clique em qualquer área de foto para abrir câmera/galeria
- Fotos são comprimidas automaticamente
- Preview da foto aparece imediatamente após captura
- Todas as fotos são armazenadas no servidor

### 📊 Banco de Dados Estruturado

Tabelas criadas:
- **clientes** - dados do cliente
- **tanques** - informações do tanque (capacidade, condição)
- **itens_tanque** - cada pergunta com sua foto e resposta

---

## 🚀 Como Usar

### 1. **Iniciar a Aplicação**

```bash
cd /home/ubuntu/pesquisa-tanques-inteligentes
npm start
```

Servidor rodará em: `http://localhost:3000`

### 2. **Fluxo de Uso**

#### **Passo 1: Cadastrar Cliente**
- Clique em "Novo Cliente"
- Preencha:
  - Código do Cliente (ex: CLI-001)
  - Nome do Contato
  - Celular com DDD
  - Quantidade de Tanques
- Clique "Próximo: Cadastrar Tanques"

#### **Passo 2: Cadastrar Tanques**
- Selecione capacidade (400L ou 1000L)
- Selecione condição do plástico
- Para cada item:
  - Marque o checkbox se aplicável
  - Clique na área de foto para capturar
  - Foto aparecerá no preview
- Perguntas dependentes aparecerão automaticamente
- Clique "✓ Salvar Tanques"

#### **Passo 3: Visualizar Dados**
- Clique em "Listar Clientes"
- Veja todos os clientes cadastrados
- Clique em um cliente para ver detalhes
- Todos os tanques e fotos aparecem

#### **Passo 4: Relatórios**
- Clique em "Relatórios"
- Veja estatísticas gerais

---

## 📱 Para Tablets

A aplicação é **totalmente responsiva** e otimizada para tablets:

✅ Interface toca-friendly
✅ Botões grandes e fáceis de clicar
✅ Fotos em tamanho legível
✅ Funciona em orientação retrato e paisagem
✅ Captura nativa de câmera do dispositivo

---

## 🔧 Endpoints da API

```
GET    /api/clientes                    - Listar todos os clientes
POST   /api/clientes                    - Criar novo cliente
PUT    /api/clientes/:id                - Atualizar cliente
DELETE /api/clientes/:id                - Deletar cliente

GET    /api/clientes/:cliente_id/tanques - Listar tanques do cliente
POST   /api/tanques                     - Criar novo tanque
PUT    /api/tanques/:id                 - Atualizar tanque
DELETE /api/tanques/:id                 - Deletar tanque

GET    /api/tanques/:tanque_id/itens    - Listar itens do tanque
POST   /api/itens                       - Criar novo item
PUT    /api/itens/:id                   - Atualizar item
DELETE /api/itens/:id                   - Deletar item

POST   /api/upload                      - Upload de foto
DELETE /api/uploads/:filename           - Deletar foto
```

---

## 📁 Estrutura de Pastas

```
pesquisa-tanques-inteligentes/
├── src/
│   ├── server.js                  # Servidor principal
│   ├── models/database.js         # Configuração do banco
│   ├── controllers/
│   │   ├── clientesController.js
│   │   ├── tanquesController.js
│   │   ├── itensController.js     # ← NOVO: Gerencia itens com fotos
│   │   └── uploadController.js
│   └── routes/api.js              # Rotas da API
├── public/
│   ├── index.html                 # Página inicial
│   ├── formulario-tanques.html    # ← REFATORADO: Com fotos individuais
│   └── detalhes-cliente.html
├── uploads/                       # Fotos dos clientes
├── database.db                    # Banco de dados SQLite
├── package.json
├── README.md
└── GUIA_USO.md
```

---

## 🎨 Recursos Visuais

- **Cor Principal**: Roxo (#667eea) - Profissional e moderno
- **Fundo**: Gradiente roxo para tablets
- **Ícones**: Emojis para melhor compreensão visual
- **Abas**: Navegação clara entre seções

---

## 🔐 Segurança

✅ Fotos armazenadas no servidor
✅ Dados persistentes em banco SQLite
✅ Validação de entrada no backend
✅ Sem autenticação (conforme solicitado)

---

## 📝 Exemplo de Resposta Salva

Quando um vendedor preenche o formulário, os dados salvos incluem:

```json
{
  "cliente": {
    "cod_cliente": "CLI-001",
    "nome_contato": "Maria Silva",
    "celular_ddd": "(11) 98765-4321",
    "quantidade_tanques": 1
  },
  "tanque": {
    "numero_tanque": 1,
    "capacidade_litros": 400,
    "condicao_plastico": "bom"
  },
  "itens": [
    {
      "tipo_item": "propulsora",
      "foto_url": "/uploads/propulsora-1234567890.jpg",
      "resposta_sim_nao": 1,
      "observacoes": "Propulsora em bom estado"
    },
    {
      "tipo_item": "propulsora_lacre",
      "foto_url": "/uploads/propulsora-lacre-1234567890.jpg",
      "resposta_sim_nao": 1
    },
    // ... mais itens
  ]
}
```

---

## 🚨 Troubleshooting

### Servidor não inicia?
```bash
# Limpar banco de dados
rm database.db

# Reiniciar
npm start
```

### Fotos não carregam?
- Verifique se a pasta `/uploads` existe
- Verifique permissões: `chmod 755 uploads/`

### Banco de dados corrompido?
```bash
# Deletar e recriar
rm database.db
npm start
```

---

## 📞 Suporte

Para adicionar mais tanques por cliente, basta aumentar o número em "Quantidade de Tanques" no cadastro inicial.

Cada tanque terá todos os 8 itens com fotos individuais.

---

## ✨ Pronto para Usar!

A aplicação está **100% funcional** e pronta para seus vendedores usarem em tablets. 

Acesse: `http://localhost:3000`

Bom trabalho! 🎉
