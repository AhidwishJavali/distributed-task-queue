# Distributed Task Queue

A distributed task queue built with Node.js, Express, BullMQ, Redis, PostgreSQL, React, and Docker.

The application allows users to create image-processing jobs with configurable priority and delay. Jobs are processed asynchronously by multiple workers, progress is tracked in real time, failed jobs are moved to a Dead Letter Queue (DLQ), and can be retried later.

The main goal of the project was to demonstrate a distributed task queue architecture. I used image processing as the workload because it's CPU-intensive and makes it easy to visualize asynchronous processing, retries, worker distribution, and the Dead Letter Queue.

---

## Tech Stack

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Redis
- BullMQ
- Sharp

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

### DevOps

- Docker
- Docker Compose

---

## Features

- Create image-processing jobs
- Edit pending jobs
- Delete individual jobs
- Delete all jobs
- Job priority (High, Medium, Low)
- Delayed job execution
- Search jobs
- Filter by status
- Filter by priority
- Sort by newest or oldest
- Live progress tracking
- Worker assignment display
- Processing stage tracking
- Job execution logs
- Dead Letter Queue (DLQ)
- Retry failed jobs
- Delete individual failed jobs
- Clear entire DLQ
- Dashboard statistics
- Image processing using Sharp
- Multiple worker processes
- Fully containerized using Docker

---

## Project Structure

```
distributed-task-queue/
│
├── backend/
│   ├── src/
│   ├── prisma/
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   └── Dockerfile
│
└── docker-compose.yml
```

---

## Running the Project

## Prerequisites

Before running the project, make sure the following are installed:

- Git
- Docker Desktop (Docker Engine + Docker Compose)
- Start Docker Desktop

### Clone the repository

```bash
git clone <repository-url>
cd distributed-task-queue
```

### Build the containers

```bash
docker compose build
```

### Start the application

```bash
docker compose up
```

The application will start:

| Service     | URL                   |
| ----------- | --------------------- |
| Frontend    | http://127.0.0.1:4173 |
| Backend API | http://127.0.0.1:5000 |

---

## Docker Services

The project runs the following containers:

- Frontend
- Backend API
- PostgreSQL
- Redis
- Worker 1
- Worker 2
- Worker 3
- DLQ Worker

---

## Note

The project is intended to run entirely through Docker Compose. Starting the application automatically launches the frontend, backend, PostgreSQL, Redis, worker processes, and the DLQ worker.

## Job Lifecycle

```
Create Job
      │
      ▼
 PostgreSQL
      │
      ▼
 BullMQ Queue
      │
      ▼
 Worker
      │
 ┌────┴────┐
 │         │
 ▼         ▼
Success   Failure
 │         │
 ▼         ▼
Completed  Dead Letter Queue
              │
              ▼
           Retry Job
```

---

## Image Processing

Each job processes one of the sample images included with the project.

The worker:

- reads the input image
- resizes it
- converts it to grayscale
- saves the processed image
- updates the job status and progress

Both the original and processed images can be viewed from the dashboard.

---

## Environment Variables

### Backend

```
PORT=5000

DATABASE_URL=postgresql://...

REDIS_HOST=redis

REDIS_PORT=6379
```

### Frontend

```
VITE_API_URL=http://127.0.0.1:5000/api
```

---

## Notes

- PostgreSQL stores all job data.
- Redis is used only for queue management.
- Processed images are stored in a shared Docker volume.
- The project is designed to run entirely through Docker Compose.
