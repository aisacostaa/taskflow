// src/taskController.js
// Controlador de tarefas: processa as requisições HTTP e chama o modelo

const Task = require("./tasks");

/**
 * POST /tasks
 * Cria uma nova tarefa
 */
function createTask(req, res) {
  try {
    const task = Task.create(req.body);
    return res.status(201).json({ success: true, data: task });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}

/**
 * GET /tasks
 * Lista todas as tarefas. Aceita query param ?status=pendente|em_progresso|concluida
 */
function getAllTasks(req, res) {
  const { status } = req.query;
  const tasks = Task.findAll(status || null);
  return res.status(200).json({ success: true, data: tasks, total: tasks.length });
}

/**
 * GET /tasks/:id
 * Busca uma tarefa pelo ID
 */
function getTaskById(req, res) {
  const task = Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ success: false, message: "Tarefa não encontrada." });
  }

  return res.status(200).json({ success: true, data: task });
}

/**
 * PUT /tasks/:id
 * Atualiza uma tarefa existente
 */
function updateTask(req, res) {
  const task = Task.update(req.params.id, req.body);

  if (!task) {
    return res.status(404).json({ success: false, message: "Tarefa não encontrada." });
  }

  return res.status(200).json({ success: true, data: task });
}

/**
 * PATCH /tasks/:id/complete
 * Marca uma tarefa como concluída (funcionalidade adicionada na mudança de escopo)
 */
function completeTask(req, res) {
  const task = Task.complete(req.params.id);

  if (!task) {
    return res.status(404).json({ success: false, message: "Tarefa não encontrada." });
  }

  return res.status(200).json({ success: true, data: task });
}

/**
 * DELETE /tasks/:id
 * Remove uma tarefa pelo ID
 */
function deleteTask(req, res) {
  const removed = Task.remove(req.params.id);

  if (!removed) {
    return res.status(404).json({ success: false, message: "Tarefa não encontrada." });
  }

  return res.status(200).json({ success: true, message: "Tarefa removida com sucesso." });
}

module.exports = { createTask, getAllTasks, getTaskById, updateTask, completeTask, deleteTask };
// controlador de tarefas
