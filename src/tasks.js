// src/tasks.js
// Modelo de dados e lógica de negócio das tarefas
// Utiliza armazenamento em memória (array) simulando um banco de dados

let tasks = []; // Armazena as tarefas em memória
let nextId = 1; // Contador para gerar IDs únicos

/**
 * Cria uma nova tarefa
 * @param {Object} data - Dados da tarefa (title, description, priority)
 * @returns {Object} A tarefa criada
 */
function create(data) {
  // Valida se o título foi informado
  if (!data.title || data.title.trim() === "") {
    throw new Error("O título da tarefa é obrigatório.");
  }

  const task = {
    id: nextId++,
    title: data.title.trim(),
    description: data.description ? data.description.trim() : "",
    status: "pendente", // Status padrão ao criar
    priority: data.priority || "media", // Prioridade padrão: média
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(task);
  return task;
}

/**
 * Retorna todas as tarefas, com filtro opcional por status
 * @param {string} status - Filtro opcional: 'pendente', 'em_progresso', 'concluida'
 * @returns {Array} Lista de tarefas
 */
function findAll(status = null) {
  if (status) {
    return tasks.filter((t) => t.status === status);
  }
  return tasks;
}

/**
 * Busca uma tarefa pelo ID
 * @param {number} id - ID da tarefa
 * @returns {Object|null} A tarefa encontrada ou null
 */
function findById(id) {
  return tasks.find((t) => t.id === Number(id)) || null;
}

/**
 * Atualiza os dados de uma tarefa existente
 * @param {number} id - ID da tarefa
 * @param {Object} data - Dados a atualizar
 * @returns {Object|null} A tarefa atualizada ou null se não encontrada
 */
function update(id, data) {
  const index = tasks.findIndex((t) => t.id === Number(id));

  if (index === -1) return null;

  // Atualiza apenas os campos enviados, mantendo os demais
  tasks[index] = {
    ...tasks[index],
    title: data.title ? data.title.trim() : tasks[index].title,
    description:
      data.description !== undefined
        ? data.description.trim()
        : tasks[index].description,
    status: data.status || tasks[index].status,
    priority: data.priority || tasks[index].priority,
    updatedAt: new Date().toISOString(),
  };

  return tasks[index];
}

/**
 * Marca uma tarefa como concluída diretamente (mudança de escopo)
 * @param {number} id - ID da tarefa
 * @returns {Object|null} A tarefa atualizada ou null se não encontrada
 */
function complete(id) {
  const index = tasks.findIndex((t) => t.id === Number(id));

  if (index === -1) return null;

  tasks[index].status = "concluida";
  tasks[index].updatedAt = new Date().toISOString();

  return tasks[index];
}

/**
 * Remove uma tarefa pelo ID
 * @param {number} id - ID da tarefa
 * @returns {boolean} true se removida, false se não encontrada
 */
function remove(id) {
  const index = tasks.findIndex((t) => t.id === Number(id));

  if (index === -1) return false;

  tasks.splice(index, 1);
  return true;
}

/**
 * Limpa todas as tarefas (usado nos testes para resetar o estado)
 */
function reset() {
  tasks = [];
  nextId = 1;
}

module.exports = { create, findAll, findById, update, complete, remove, reset };
// modelo de tarefas
// rota de conclusao rapida
// validacao de prioridade adicionada
