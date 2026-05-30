// tests/tasks.test.js
// Testes automatizados do sistema de gerenciamento de tarefas
// Framework: Jest | HTTP: Supertest

const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/tasks");

// Reseta o estado das tarefas antes de cada teste
beforeEach(() => {
  Task.reset();
});

// ─────────────────────────────────────────────
// POST /tasks — Criar tarefa
// ─────────────────────────────────────────────
describe("POST /tasks", () => {
  test("deve criar uma tarefa com dados válidos", async () => {
    const res = await request(app).post("/tasks").send({
      title: "Configurar servidor",
      description: "Instalar e configurar o Node.js",
      priority: "alta",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Configurar servidor");
    expect(res.body.data.status).toBe("pendente");
    expect(res.body.data.priority).toBe("alta");
  });

  test("deve retornar erro 400 ao criar tarefa sem título", async () => {
    const res = await request(app).post("/tasks").send({
      description: "Tarefa sem título",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBeTruthy();
  });

  test("deve usar prioridade 'media' como padrão quando não informada", async () => {
    const res = await request(app).post("/tasks").send({
      title: "Tarefa sem prioridade",
    });

    expect(res.status).toBe(201);
    expect(res.body.data.priority).toBe("media");
  });
});

// ─────────────────────────────────────────────
// GET /tasks — Listar tarefas
// ─────────────────────────────────────────────
describe("GET /tasks", () => {
  test("deve retornar lista vazia quando não há tarefas", async () => {
    const res = await request(app).get("/tasks");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
    expect(res.body.total).toBe(0);
  });

  test("deve retornar todas as tarefas criadas", async () => {
    await request(app).post("/tasks").send({ title: "Tarefa 1" });
    await request(app).post("/tasks").send({ title: "Tarefa 2" });

    const res = await request(app).get("/tasks");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.total).toBe(2);
  });

  test("deve filtrar tarefas por status", async () => {
    await request(app).post("/tasks").send({ title: "Tarefa A" });
    const t = await request(app).post("/tasks").send({ title: "Tarefa B" });

    // Marca a segunda como concluída
    await request(app).patch(`/tasks/${t.body.data.id}/complete`);

    const res = await request(app).get("/tasks?status=concluida");

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].status).toBe("concluida");
  });
});

// ─────────────────────────────────────────────
// GET /tasks/:id — Buscar por ID
// ─────────────────────────────────────────────
describe("GET /tasks/:id", () => {
  test("deve retornar a tarefa correta pelo ID", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({ title: "Minha tarefa" });

    const id = created.body.data.id;
    const res = await request(app).get(`/tasks/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(id);
    expect(res.body.data.title).toBe("Minha tarefa");
  });

  test("deve retornar 404 para ID inexistente", async () => {
    const res = await request(app).get("/tasks/999");

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ─────────────────────────────────────────────
// PUT /tasks/:id — Atualizar tarefa
// ─────────────────────────────────────────────
describe("PUT /tasks/:id", () => {
  test("deve atualizar os dados de uma tarefa existente", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({ title: "Tarefa original" });

    const id = created.body.data.id;

    const res = await request(app).put(`/tasks/${id}`).send({
      title: "Tarefa atualizada",
      status: "em_progresso",
      priority: "alta",
    });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("Tarefa atualizada");
    expect(res.body.data.status).toBe("em_progresso");
    expect(res.body.data.priority).toBe("alta");
  });

  test("deve retornar 404 ao atualizar ID inexistente", async () => {
    const res = await request(app).put("/tasks/999").send({ title: "X" });

    expect(res.status).toBe(404);
  });
});

// ─────────────────────────────────────────────
// PATCH /tasks/:id/complete — Conclusão rápida
// ─────────────────────────────────────────────
describe("PATCH /tasks/:id/complete", () => {
  test("deve marcar a tarefa como concluída", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({ title: "Tarefa para concluir" });

    const id = created.body.data.id;
    const res = await request(app).patch(`/tasks/${id}/complete`);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("concluida");
  });

  test("deve retornar 404 ao concluir ID inexistente", async () => {
    const res = await request(app).patch("/tasks/999/complete");

    expect(res.status).toBe(404);
  });
});

// ─────────────────────────────────────────────
// DELETE /tasks/:id — Remover tarefa
// ─────────────────────────────────────────────
describe("DELETE /tasks/:id", () => {
  test("deve remover uma tarefa existente", async () => {
    const created = await request(app)
      .post("/tasks")
      .send({ title: "Tarefa para deletar" });

    const id = created.body.data.id;
    const res = await request(app).delete(`/tasks/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Confirma que foi removida
    const check = await request(app).get(`/tasks/${id}`);
    expect(check.status).toBe(404);
  });

  test("deve retornar 404 ao deletar ID inexistente", async () => {
    const res = await request(app).delete("/tasks/999");

    expect(res.status).toBe(404);
  });
});
