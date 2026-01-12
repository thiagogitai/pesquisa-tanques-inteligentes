# Guia de Uso - Pesquisa Tanques Inteligentes

## Visão Geral

A aplicação **Pesquisa Tanques Inteligentes** é um sistema web responsivo desenvolvido especificamente para tablets, permitindo que vendedores cadastrem e acompanhem pesquisas de clientes com tanques de troca inteligente. O sistema inclui captura de fotos, armazenamento em banco de dados e geração de relatórios.

## Características Principais

**Interface Responsiva para Tablets**: Design otimizado com botões grandes e fáceis de tocar, cores de alto contraste e navegação intuitiva.

**Captura de Fotos Nativa**: Integração com câmera do dispositivo para capturar fotos dos tanques diretamente na aplicação.

**Formulário Dinâmico**: Duplicação automática de seções de tanques conforme a quantidade informada pelo cliente.

**Banco de Dados Persistente**: Armazenamento seguro de todos os dados em SQLite com possibilidade de sincronização.

**API RESTful Completa**: Backend robusto para gerenciamento de clientes, tanques e uploads de fotos.

**Relatórios em Tempo Real**: Estatísticas gerais e informações consolidadas dos clientes.

## Fluxo de Uso

### 1. Acessar a Aplicação

Abra o navegador do tablet e acesse: `http://localhost:3000` (ou a URL pública fornecida)

### 2. Cadastrar Novo Cliente

Na aba **"Novo Cliente"**, preencha os seguintes campos obrigatórios:

- **Código do Cliente**: Identificador único (ex: CLI-001, CLI-002)
- **Nome do Contato**: Nome completo da pessoa responsável
- **Celular com DDD**: Telefone para contato (ex: (11) 99999-9999)
- **Quantidade de Tanques**: Número de tanques que o cliente possui

Clique em **"Próximo: Cadastrar Tanques"** para prosseguir.

### 3. Cadastrar Tanques

Para cada tanque, você preencherá um formulário com as seguintes informações:

**Foto do Tanque**: Clique na área de preview para capturar uma foto do conjunto do tanque usando a câmera do dispositivo.

**Capacidade**: Selecione entre 400 Litros ou 1000 Litros.

**Condição do Plástico**: Avalie o estado do tanque (Excelente, Bom, Regular ou Ruim).

**Componentes Presentes**:
- Tem Propulsora? (Sim/Não)
- Propulsora com Lacre? (Sim/Não)
- Tem Mangueira? (Sim/Não)
- Tem Pistola de Abastecimento? (Sim/Não)
- Pistola Digital Funcionando? (Sim/Não)
- Tem Bacia de Contenção? (Sim/Não)
- Tem Lacre de Segurança? (Sim/Não)

**Interesse do Cliente**: Marque se o cliente tem interesse em continuar utilizando o tanque inteligente.

**Observações**: Campo livre para adicionar notas adicionais sobre o tanque (condições especiais, problemas detectados, etc).

Clique em **"✓ Salvar Tanques"** para finalizar o cadastro.

### 4. Visualizar Clientes Cadastrados

Na aba **"Listar Clientes"**, você verá uma lista de todos os clientes cadastrados com:
- Nome do contato
- Código do cliente
- Número de telefone
- Quantidade de tanques

Clique em qualquer cliente para ver os detalhes completos de todos os seus tanques.

### 5. Visualizar Detalhes do Cliente

Na página de detalhes, você encontrará:

**Informações do Cliente**: Código, nome, telefone e quantidade total de tanques.

**Tanques Cadastrados**: Para cada tanque, é exibido:
- Foto (se disponível)
- Capacidade
- Condição do plástico
- Status de todos os componentes (com indicação visual Sim/Não)
- Interesse em continuar
- Observações adicionais

**Ações Disponíveis**:
- **Editar**: Modificar dados do tanque (em desenvolvimento)
- **Deletar**: Remover o tanque do cadastro
- **Adicionar Tanque**: Cadastrar um novo tanque para o cliente

### 6. Consultar Relatórios

Na aba **"Relatórios"**, você verá estatísticas gerais como:
- Total de clientes cadastrados
- Total de tanques
- Média de tanques por cliente

## Dicas de Uso

**Captura de Fotos**: Certifique-se de que o dispositivo tem permissão para acessar a câmera. Tire fotos bem iluminadas e com boa qualidade.

**Preenchimento do Formulário**: Todos os campos marcados com * são obrigatórios. O sistema não permite avançar sem preenchê-los.

**Navegação**: Use os botões de abas no topo para navegar entre as diferentes seções da aplicação.

**Voltar**: Sempre há um botão "← Voltar" para retornar à página anterior sem perder dados já salvos.

**Sincronização**: Os dados são salvos automaticamente no banco de dados assim que você clica em "Salvar".

## Troubleshooting

**A câmera não funciona**: Verifique se o navegador tem permissão para acessar a câmera do dispositivo. Consulte as configurações de privacidade do seu tablet.

**Foto muito grande**: A aplicação comprime automaticamente as fotos para otimizar o armazenamento. Tamanho máximo aceito é 10MB.

**Erro ao salvar**: Se receber um erro ao salvar, verifique sua conexão com a internet e tente novamente.

**Dados não aparecem**: Atualize a página (F5 ou gesto de atualização do navegador) para recarregar os dados do servidor.

## Estrutura de Dados

### Cliente
Cada cliente possui:
- Código único
- Nome do contato
- Telefone
- Quantidade de tanques
- Data de criação e atualização

### Tanque
Cada tanque armazena:
- Número sequencial
- Foto (URL)
- Capacidade em litros
- Condição do plástico
- Status de 7 componentes diferentes
- Interesse do cliente
- Observações
- Data de criação

## Segurança

Os dados são armazenados localmente no banco de dados SQLite. Recomenda-se fazer backups periódicos do arquivo `database.db` para evitar perda de informações.

## Suporte

Para dúvidas ou problemas técnicos, consulte o arquivo README.md ou entre em contato com o desenvolvedor.
