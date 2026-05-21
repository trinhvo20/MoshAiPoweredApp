# Ai Chatbot

Create an AI chatbot that serves as customer support for a Theme Park, responding exclusively to questions based on the Theme Park data.

The system is powered by the **OpenAI API**.

This project was created using `bun init` in bun v1.3.4. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

Before running the app, we need to set up `.env` file and install dependencies.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run dev
```

## Frontend

Frontend is created with [Vite](https://vite.dev/) inside **package\client** folder -- it is a React project.

It uses [TailwindCSS](https://tailwindcss.com/) and [Shadcn](https://ui.shadcn.com/) as styling tools.

It runs on `http://localhost:5173`

## Backend

Backend is create using `bun init` inside **package\server** folder -- it is an empty typescript project.

It uses **express** as server.

It runs on `http://localhost:3000`

## Prisma

Use [Prisma v7](https://www.prisma.io/) as our Postgres serverless database and as a tool to migrate database ( migrate = connect code to database).

In **\packages\server** path, run:

```
bunx prisma migrate dev
```

## AI Models

There are 2 mini-projects in this solution:
1. Theme park customer support AI chat.
    * We use [OpenAI](https://platform.openai.com) as our AI models.
2. Summarize products reviews using AI.
    * At first, we use [OpenAI](https://platform.openai.com) to handle the summary job.
    * Later, we choose to use open-source AI models from [HuggingFace](https://huggingface.co/), because it is free.

To run AI models locally, we use a tool called [Ollama](https://ollama.com/).
* You have to install Ollama in your machine and install it in your app before you can use it in your app.