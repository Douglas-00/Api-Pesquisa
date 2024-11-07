# Pesquisa de Satisfação - API

API para gerenciar pesquisas de satisfação de clientes com funcionalidades de criação de pesquisas, perguntas, respostas e exportação de respostas em CSV.

## Funcionalidades

1. **Criação de Pesquisa**

   - Endpoint para criar uma nova pesquisa com perguntas padrão e opcionais.
   - Se nenhuma pergunta adicional for fornecida, são criadas automaticamente três perguntas padrão:
     - Público-alvo
     - Quantidade de estrelas
     - E-mail para contato

2. **Atualização de Pesquisa**

   - Permite atualizar o título, público-alvo e adicionar novas perguntas à pesquisa.

3. **Criação de Respostas**

   - Endpoint para preenchimento da pesquisa por usuários.
   - As respostas para perguntas padrão e adicionais podem ser registradas.

4. **Listagem de Respostas**

   - Lista as respostas de uma pesquisa, com possibilidade de filtragem por público-alvo e ordenação pela quantidade de estrelas.

5. **Exportação de Respostas para CSV**
   - Exporta todas as respostas de uma pesquisa para um arquivo CSV, incluindo respostas específicas para cada pergunta.

## Tecnologias

- **Node.js**
- **NestJS** como framework principal
- **Prisma** para ORM e gerenciamento do banco de dados
- **PostgreSQL** como banco de dados
- **Docker e Docker Compose** para simplificar o ambiente de desenvolvimento
- **json2csv** para exportação de dados em CSV

## Estrutura de Diretórios

- `src/`: Código principal da aplicação
  - `modules/search`: Contém os casos de uso, controladores e serviços da funcionalidade de pesquisa e respostas.
  - `db/`: Configuração do Prisma para acesso ao banco de dados.

## Pré-requisitos

- **Docker** e **Docker Compose** instalados

## Configuração e Execução

1. **Clonar o Repositório**

   ```bash
   git clone https://github.com/Douglas-00/Api-Pesquisa.git
   ```

2. **Configurar Variáveis de Ambiente**

   Certifique-se de que o arquivo `.env` contém as seguintes variáveis:

   ```
   DATABASE_URL=postgresql://<usuario>:<senha>@db:5432/search_db
   ```

3. **Iniciar o Projeto com Docker**

   No diretório raiz, execute o comando para iniciar a aplicação e o banco de dados:

   ```bash
   docker-compose up --build
   ```

4. **Acessar a API**

   A API estará disponível em `http://localhost:3000`.

## Endpoints Principais

- **Criar Pesquisa**: `POST /search`
- **Atualizar Pesquisa**: `PUT /search/:searchId`
- **Criar Resposta para Pesquisa**: `POST /search/:searchId/responses`
- **Listar Respostas da Pesquisa**: `GET /search/:searchId/responses`
  - Filtros: `targetAudience` (público-alvo) e `order` (ascendente ou descendente)
- **Exportar Respostas para CSV**: `GET /search/:searchId/responses/export`

## Exemplo de Uso dos Endpoints

### Criar uma Pesquisa

```json
POST /search
{
  "title": "Mundo Tech",
  "targetAudience": "TECH",
  "questions": [
    { "name": "Quantos anos de experiência você tem?" },
    { "name": "Gostaria de trabalhar no exterior?" }
  ]
}
```

### Criar uma Resposta

```json
POST /search/1/responses
{
  "stars": 5,
  "contactEmail": "user@example.com",
  "answers": [
    { "questionId": 2, "answerText": "Sim, gostaria." },
    { "questionId": 3, "answerText": "Tenho 5 anos de experiência." }
  ]
}
```

## Exportar Respostas em CSV

Para exportar respostas de uma pesquisa, acesse:

```
GET /search/:searchId/responses/export
```

caso não aparece no postman, colocar a url no navegador para baixar CSV.

##Testes unitarios

npm run test
