// src/app.js
// Ponto de entrada da aplicação — configura e inicia o servidor Express

const express = require("express");
const taskRouter = require("./taskRouter");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Serve os arquivos estáticos do frontend (pasta /public)
app.use(express.static(require("path").join(__dirname, "../public")));

// Rota raiz — verifica se a API está funcionando
app.get("/", (req, res) => {
  res.json({
    message: "TaskFlow API - Sistema de Gerenciamento de Tarefas",
    version: "1.0.0",
    endpoints: {
      "GET    /tasks": "Listar todas as tarefas",
      "POST   /tasks": "Criar nova tarefa",
      "GET    /tasks/:id": "Buscar tarefa por ID",
      "PUT    /tasks/:id": "Atualizar tarefa",
      "DELETE /tasks/:id": "Remover tarefa",
      "PATCH  /tasks/:id/complete": "Marcar tarefa como concluída",
    },
  });
});

// Registra as rotas de tarefas no prefixo /tasks
app.use("/tasks", taskRouter);

// Middleware de tratamento de erros genéricos
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Erro interno do servidor." });
});

// Inicia o servidor apenas se não estiver em modo de teste
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;
// servidor express
