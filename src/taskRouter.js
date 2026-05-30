// src/taskRouter.js
// Define as rotas da API REST para o recurso de tarefas

const express = require("express");
const router = express.Router();
const controller = require("./taskController");

// Rotas do CRUD principal
router.post("/", controller.createTask);         // Criar tarefa
router.get("/", controller.getAllTasks);          // Listar tarefas (com filtro opcional)
router.get("/:id", controller.getTaskById);       // Buscar tarefa por ID
router.put("/:id", controller.updateTask);        // Atualizar tarefa
router.delete("/:id", controller.deleteTask);     // Remover tarefa

// Rota adicionada na mudança de escopo: conclusão rápida
router.patch("/:id/complete", controller.completeTask); // Marcar como concluída

module.exports = router;
