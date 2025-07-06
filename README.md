# Desafio Inno Tech

Este repositório contém uma aplicação full-stack desenvolvida como parte do Desafio Inno Tech, composta por um serviço de backend e uma interface de usuário frontend.

## Estrutura do Projeto

O projeto é dividido em dois diretórios principais:

-   `backend/`: Contém o código-fonte da API.
-   `frontend/`: Contém o código-fonte da interface de usuário baseada em React.

## Backend (API)

### Descrição

O backend é uma aplicação NestJS (Node.js) que serve como a API para a aplicação. Ele é responsável por:

-   Gerenciar a lógica de negócios.
-   Expor endpoints para o frontend.
-   Interagir com o banco de dados (se aplicável, para persistência de dados).

### Tecnologias Utilizadas

Linguagens e Frameworks:
NestJS: Framework Node.js para construção de APIs.
TypeScript: Linguagem de programação.
Node.js: Plataforma de execução.
Gerenciadores de Pacote:
npm
pnpm
Bancos de Dados/Serviços Cloud:
Amazon DynamoDB: Para persistência de dados.
Inteligência Artificial:
OpenAI: Para integração com serviços de IA.
Testes Automatizados: Jest
Docker
Orquestração de Contêineres: docker compose
Controle de Versão: Git com commit semantico

Comunicação Bidirecional/Orientada a Eventos (WebSockets): A presença do módulo events/ e events.gateway.ts, juntamente com as dependências @nestjs/platform-socket.io e @nestjs/websockets, indica a utilização de WebSockets. Isso sugere uma arquitetura que suporta comunicação em tempo real e pode incorporar padrões de arquitetura orientada a eventos para certas funcionalidades.

Integração com Serviços Cloud (AWS DynamoDB): O uso de @aws-sdk/client-dynamodb e @aws-sdk/lib-dynamodb aponta para uma arquitetura que aproveita serviços de banco de dados NoSQL gerenciados na nuvem (DynamoDB). Isso é benéfico para escalabilidade e alta disponibilidade, alinhando-se a princípios de arquitetura cloud-native.

Integração com Serviços Externos (OpenAI): A dependência openai e o módulo ai/ indicam que a aplicação está preparada para se integrar com serviços de inteligência artificial de terceiros, demonstrando uma capacidade de extensão e aproveitamento de funcionalidades externas.

Padrão de Camadas (Controllers, Services): Dentro de cada módulo, o NestJS naturalmente incentiva o padrão de camadas, onde os Controllers lidam com as requisições HTTP e os Services contêm a lógica de negócios e a interação com os dados.

Bibliotecas e Ferramentas de Desenvolvimento:

### Como Rodar Localmente (Desenvolvimento)

1.  **Navegue até o diretório do backend:**
    ```bash
    cd backend
    ```
2.  **Instale as dependências:**
    ```bash
    npm install # ou pnpm install
    ```
3.  **Inicie a aplicação em modo de desenvolvimento:**
    ```bash
    npm run start:dev # ou pnpm run start:dev
    ```
    A API estará disponível em `http://localhost:3000`.

### Estrutura de Diretórios Relevantes

-   `src/`: Contém todo o código-fonte da aplicação NestJS.
    -   `ai/`: Módulo e serviço relacionados à inteligência artificial (se implementado).
    -   `dynamodb/`: Módulo e serviço para interação com DynamoDB (se implementado).
    -   `events/`: Módulo e gateway para manipulação de eventos (WebSockets, se implementado).
    -   `app.module.ts`, `app.controller.ts`, `app.service.ts`: Componentes principais da aplicação.

## Frontend (Interface do Usuário)

### Descrição

O frontend é uma Single Page Application (SPA) desenvolvida com React e Vite. Ele fornece a interface interativa para o usuário, consumindo dados do backend via API.

### Tecnologias Utilizadas

-   **React**: Biblioteca JavaScript para construir interfaces de usuário.
-   **Vite**: Uma ferramenta de build rápida para projetos web modernos.
-   **TypeScript**: Para tipagem do código React.
-   **Tailwind CSS**: Um framework CSS utilitário para estilização rápida e responsiva.
-   **Shadcn/ui**: Componentes de UI construídos com Radix UI e Tailwind CSS.
-   **npm/pnpm/bun**: Gerenciador de pacotes para dependências do JavaScript.

### Como Rodar Localmente (Desenvolvimento)

1.  **Navegue até o diretório do frontend:**
    ```bash
    cd frontend
    ```
2.  **Instale as dependências:**
    ```bash
    npm install # ou pnpm install ou bun install
    ```
3.  **Inicie a aplicação em modo de desenvolvimento:**
    ```bash
    npm run dev # ou pnpm run dev ou bun run dev
    ```
    A aplicação estará disponível em `http://localhost:8080`.

