# Distributed Task Queue

A production-inspired distributed task queue system that processes image-processing jobs asynchronously using **BullMQ**, **Redis**, **PostgreSQL**, and **React**. The application supports multiple workers, delayed execution, priority-based scheduling, Dead Letter Queue (DLQ) handling, progress tracking, and real-time job monitoring.

---

## Features

- Asynchronous job processing with BullMQ
- Multiple concurrent workers
- Priority-based scheduling (High, Medium, Low)
- Delayed job execution
- Image processing pipeline using Sharp
- Job progress tracking
- Processing logs for every job
- Dead Letter Queue (DLQ) with retry and delete support
- Search, filtering, and sorting
- Dashboard with job statistics
- Responsive React frontend
- PostgreSQL persistence using Prisma ORM

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express
- TypeScript
- BullMQ
- Redis
- PostgreSQL
- Prisma ORM
- Sharp

---

## System Architecture

```text
             +----------------------+
             |   React Frontend     |
             +----------+-----------+
                        |
                    REST APIs
                        |
             +----------v-----------+
             |   Express Backend    |
             +----------+-----------+
                        |
                Create / Manage Jobs
                        |
                 +------v------+
                 |   BullMQ    |
                 +------+------+
                        |
                     Redis Queue
                        |
        +---------------+---------------+
        |               |               |
   Worker-1        Worker-2        Worker-3
        |               |               |
        +------- Image Processing ------+
                        |
                 PostgreSQL (Prisma)
                        |
               Job Status & Job Logs
                        |
               Dead Letter Queue (DLQ)
```

---

## Project Structure

```text
distributed-task-queue
│
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── services
│   │   ├── repositories
│   │   ├── routes
│   │   ├── workers
│   │   ├── queues
│   │   ├── config
│   │   └── utils
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── types
│   │   └── utils
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- Redis
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/AhidwishJavali/distributed-task-queue.git
cd distributed-task-queue
```

Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Configure the backend `.env` file with your PostgreSQL and Redis credentials.

---

## Running the Project

### Start Backend

```bash
cd backend
npm run dev
```

### Start Workers

```bash
npm run worker1
npm run worker2
npm run worker3
```

### Start Dead Letter Queue Worker

```bash
npm run dlq-worker
```

### Start Frontend

```bash
cd frontend
npm run dev
```

---

## API Overview

### Jobs

- Create Job
- Get All Jobs
- Get Job by ID
- Update Pending Job
- Delete Job
- Delete All Jobs
- Get Job Statistics
- Get Job Logs

### Dead Letter Queue

- View Failed Jobs
- Retry Failed Job
- Delete Failed Job
- Clear DLQ

---

## Future Improvements

- Docker Compose support
- Authentication and user management
- Deployment on cloud platforms
- WebSocket-based live updates
- Job cancellation support

---

## Author

**Ahidwish Javali**

GitHub: https://github.com/AhidwishJavali
