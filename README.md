# TaskFlow — Sistema de Gerenciamento de Tarefas

Sistema web de gerenciamento de tarefas desenvolvido para a TechFlow Solutions, utilizando metodologia ágil híbrida (Scrum + Kanban).

## Objetivo

Permitir que equipes acompanhem o fluxo de trabalho em tempo real, priorizem tarefas críticas e monitorem o progresso de cada atividade.

## Escopo Inicial

- CRUD completo de tarefas (criar, listar, buscar, atualizar, excluir)
- Interface web completa para interação do usuário
- Filtro de tarefas por status
- Atribuição de prioridade (baixa, média, alta)
- API REST em Node.js com Express
- Testes automatizados com Jest
- Pipeline de CI com GitHub Actions

## Mudança de Escopo

**Funcionalidade adicionada:** Botão de conclusão rápida de tarefas.

**Justificativa:** O cliente identificou que abrir o formulário completo apenas para atualizar o status gerava perda de tempo para a equipe operacional. A solução foi adicionar a rota `PATCH /tasks/:id/complete`, que marca a tarefa como concluída em uma única chamada, sem necessidade de enviar todos os dados do formulário.

**Impacto:** Nova rota na API, novo método no modelo, novo card no Kanban e novo teste automatizado.

## Tecnologias

- Node.js
- Express
- HTML, CSS e JavaScript (frontend)
- Jest
- Supertest
- GitHub Actions

## Estrutura do Projeto

```
taskflow/
├── src/
│   ├── app.js            # Servidor Express
│   ├── taskRouter.js     # Rotas da API
│   ├── taskController.js # Controladores
│   └── tasks.js          # Modelo e lógica de negócio
├── public/
│   └── index.html        # Interface web (frontend)
├── tests/
│   └── tasks.test.js     # Testes automatizados
├── docs/                 # Documentação e diagramas UML
├── .github/
│   └── workflows/
│       └── ci.yml        # Pipeline GitHub Actions
└── package.json
```

## Interface Web

O sistema conta com uma interface web completa acessível em `http://localhost:3000`.

**Funcionalidades da interface:**
- Dashboard com estatísticas em tempo real (total, em progresso, concluídas, prioridade alta)
- Listagem de tarefas com indicador visual de prioridade
- Filtros por status (todas, pendentes, em progresso, concluídas)
- Criação e edição de tarefas via modal
- Conclusão rápida de tarefas com um clique
- Remoção de tarefas com confirmação

## Como Executar

**Pré-requisitos:** Node.js 18+ instalado

```bash
# Instalar dependências
npm install

# Iniciar o servidor
npm start

# Rodar os testes
npm test
```

Após iniciar, acesse `http://localhost:3000` no navegador para usar a interface web.

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /tasks | Listar todas as tarefas |
| GET | /tasks?status=pendente | Filtrar por status |
| POST | /tasks | Criar nova tarefa |
| GET | /tasks/:id | Buscar tarefa por ID |
| PUT | /tasks/:id | Atualizar tarefa |
| PATCH | /tasks/:id/complete | Marcar como concluída |
| DELETE | /tasks/:id | Remover tarefa |

## Exemplo de Uso

```bash
# Criar tarefa
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Revisar código", "priority": "alta"}'

# Listar tarefas
curl http://localhost:3000/tasks

# Marcar como concluída
curl -X PATCH http://localhost:3000/tasks/1/complete
```

## Metodologia

O projeto adota uma abordagem híbrida entre **Scrum** e **Kanban**:
- Sprints de uma semana com revisão de entregas
- Quadro Kanban no GitHub Projects com colunas: To Do, In Progress e Done
- Commits semânticos documentando cada alteração
- Pipeline de CI garantindo qualidade a cada push

## Integração Contínua

O GitHub Actions executa os testes automaticamente a cada push nas branches `main` e `develop`. O pipeline instala as dependências, roda todos os testes com Jest e exibe o relatório de cobertura.
