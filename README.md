# ⚙️ Task Queue API & Background Worker

Uma API RESTful desenvolvida em **Node.js** e **TypeScript** que implementa uma arquitetura de processamento assíncrono baseada no padrão *Producer-Consumer*. 

O sistema separa o recebimento de requisições do processamento de dados pesados, garantindo que a API principal não seja bloqueada. Um *Worker* em background consome a fila e processa as tarefas de forma resiliente.

## 🚀 Tecnologias Utilizadas
- **Node.js** & **TypeScript**
- **Express.js** (Roteamento da API)
- **SQLite** (Motor da fila, persistência e controle de estado)
- **Docker** (Containerização e padronização do ambiente)

## 🏗️ Arquitetura
1. **Producer:** O Client envia uma requisição `POST`. A API salva a tarefa no SQLite com o status `PENDING` e retorna um `jobId` instantaneamente (Non-blocking).
2. **Consumer (Worker):** Um processo em background verifica a base de dados periodicamente.
3. **Processamento:** O Worker isola tarefas `PENDING`, atualiza o estado para `PROCESSING` (evitando concorrência) e, ao finalizar, marca como `COMPLETED`.

## 🔌 Endpoints

### 1. Enfileirar uma Tarefa (POST /jobs)
Recebe uma carga de trabalho e coloca na fila de processamento.

**Request:**
```json
{
  "type": "processar_pagamento",
  "payload": { "valor": 150.00 }
}
```

**Response (201 Created):**
```json
{
  "message": "Tarefa enfileirada!",
  "jobId": "job_1703658556067",
  "status": "PENDING"
}
```

### 2. Consultar Status da Tarefa (GET /jobs/:id)
Permite ao cliente verificar o progresso de uma tarefa assíncrona.

**Response (200 OK):**
```json
{
  "jobId": "job_1703658556067",
  "type": "processar_pagamento",
  "status": "COMPLETED",
  "createdAt": "2026-11-02 19:40:00"
}
```

## 🐳 Executando com Docker (Recomendado)

O projeto está totalmente containerizado para rodar em qualquer ambiente sem necessidade de instalar dependências locais.

```bash
# 1. Construir a imagem Docker
docker build -t task-queue-api .

# 2. Rodar o container expondo a porta 3000
docker run -p 3000:3000 task-queue-api
```

## 💻 Executando Localmente (Desenvolvimento)

```bash
# Instalar as dependências
npm install

# Iniciar o servidor e o worker
npm run dev
```
