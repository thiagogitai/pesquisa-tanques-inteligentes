# Pesquisa Tanques Inteligentes

Sistema de formulário dinâmico para vendedores cadastrarem pesquisas de clientes com tanques de troca inteligente, otimizado para tablets.

## Características

✅ **Interface Responsiva**: Otimizada para tablets e dispositivos móveis
✅ **Captura de Fotos**: Integração com câmera do dispositivo
✅ **Formulário Dinâmico**: Duplicação automática de seções conforme quantidade de tanques
✅ **Banco de Dados**: Armazenamento persistente com SQLite
✅ **API RESTful**: Backend completo para gerenciamento de dados
✅ **Upload de Imagens**: Otimização automática com Sharp

## Estrutura do Projeto

```
pesquisa-tanques-inteligentes/
├── src/
│   ├── controllers/
│   │   ├── clientesController.js      # Lógica de clientes
│   │   ├── tanquesController.js       # Lógica de tanques
│   │   └── uploadController.js        # Gerenciamento de uploads
│   ├── models/
│   │   └── database.js                # Configuração do banco de dados
│   ├── routes/
│   │   └── api.js                     # Rotas da API
│   └── server.js                      # Servidor principal
├── public/
│   ├── index.html                     # Página principal
│   ├── formulario-tanques.html        # Formulário de tanques
│   ├── detalhes-cliente.html          # Detalhes do cliente
│   └── uploads/                       # Armazenamento de fotos
├── package.json                       # Dependências
├── .env                               # Variáveis de ambiente
└── database.db                        # Banco de dados SQLite
```

## Instalação

### Pré-requisitos
- Node.js 14+ 
- npm ou yarn

### Passos

1. **Instalar dependências** (já feito):
```bash
npm install
```

2. **Configurar variáveis de ambiente**:
O arquivo `.env` já está configurado com:
```
PORT=3000
NODE_ENV=development
DATABASE_URL=./database.db
```

3. **Iniciar o servidor**:
```bash
npm start
```

O servidor rodará em `http://localhost:3000`

## Uso

### Fluxo de Cadastro

1. **Acessar a página inicial** (`/`)
2. **Preencher dados do cliente**:
   - Código do cliente
   - Nome do contato
   - Celular com DDD
   - Quantidade de tanques

3. **Cadastrar tanques**:
   - Para cada tanque, preencher:
     - Foto (capturada pela câmera)
     - Capacidade (400L ou 1000L)
     - Condição do plástico
     - Componentes presentes (propulsora, mangueira, pistola, etc.)
     - Lacres e segurança
     - Interesse em continuar
     - Observações

4. **Visualizar dados**:
   - Listar clientes cadastrados
   - Ver detalhes de cada cliente
   - Consultar informações de todos os tanques
   - Gerar relatórios

## API Endpoints

### Clientes
- `GET /api/clientes` - Listar todos os clientes
- `GET /api/clientes/:id` - Obter cliente específico
- `POST /api/clientes` - Criar novo cliente
- `PUT /api/clientes/:id` - Atualizar cliente
- `DELETE /api/clientes/:id` - Deletar cliente

### Tanques
- `GET /api/clientes/:cliente_id/tanques` - Listar tanques de um cliente
- `POST /api/tanques` - Criar novo tanque
- `PUT /api/tanques/:id` - Atualizar tanque
- `DELETE /api/tanques/:id` - Deletar tanque

### Upload
- `POST /api/upload` - Fazer upload de foto
- `DELETE /api/uploads/:filename` - Deletar foto

## Campos do Formulário

### Cliente
- **Código**: Identificador único do cliente
- **Nome do Contato**: Nome da pessoa responsável
- **Celular com DDD**: Telefone para contato
- **Quantidade de Tanques**: Número de tanques a cadastrar

### Tanque
- **Foto**: Imagem do conjunto do tanque
- **Capacidade**: 400L ou 1000L
- **Condição do Plástico**: Excelente, Bom, Regular ou Ruim
- **Propulsora**: Presença e lacre
- **Mangueira**: Presença
- **Pistola de Abastecimento**: Presença e funcionamento digital
- **Bacia de Contenção**: Presença
- **Lacre de Segurança**: Presença
- **Interesse em Continuar**: Intenção do cliente
- **Observações**: Notas adicionais

## Banco de Dados

### Tabela: clientes
```sql
id (INTEGER PRIMARY KEY)
cod_cliente (TEXT UNIQUE)
nome_contato (TEXT)
celular_ddd (TEXT)
quantidade_tanques (INTEGER)
data_criacao (DATETIME)
data_atualizacao (DATETIME)
```

### Tabela: tanques
```sql
id (INTEGER PRIMARY KEY)
cliente_id (INTEGER FOREIGN KEY)
numero_tanque (INTEGER)
foto_url (TEXT)
capacidade_litros (INTEGER)
condicao_plastico (TEXT)
tem_propulsora (INTEGER)
propulsora_lacre (INTEGER)
tem_mangueira (INTEGER)
tem_pistola (INTEGER)
pistola_digital_funcionando (INTEGER)
tem_bacia_contencao (INTEGER)
tem_lacre_seguranca (INTEGER)
interesse_continuar (INTEGER)
observacoes (TEXT)
data_criacao (DATETIME)
```

## Otimizações para Tablet

- Interface responsiva com grid layout
- Botões grandes e fáceis de tocar
- Suporte a captura de câmera nativa
- Compressão automática de imagens
- Scroll otimizado para telas pequenas
- Cores de alto contraste para melhor legibilidade

## Troubleshooting

### Porta já em uso
Se a porta 3000 já estiver em uso, modifique o `.env`:
```
PORT=3001
```

### Erro ao fazer upload de foto
- Verifique permissões da pasta `public/uploads/`
- Certifique-se que o dispositivo tem acesso à câmera
- Verifique o tamanho máximo (10MB)

### Banco de dados não criado
O banco de dados é criado automaticamente na primeira execução. Se houver problemas:
```bash
rm database.db
npm start
```

## Desenvolvimento

### Adicionar nova rota
1. Criar função no controller apropriado
2. Adicionar rota em `src/routes/api.js`
3. Testar via API

### Modificar banco de dados
1. Editar `src/models/database.js`
2. Reiniciar servidor
3. Banco será recriado automaticamente

## Licença

ISC

## Suporte

Para dúvidas ou problemas, consulte a documentação ou entre em contato com o desenvolvedor.
