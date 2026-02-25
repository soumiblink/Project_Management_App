# PRO - A Project Management Application

A modern, full-stack project management application built with Next.js 14, TypeScript, MongoDB, and Socket.io for real-time collaboration.

## Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (Access & Refresh Tokens)
- **Real-time**: Socket.io
- **UI**: Tailwind CSS, Shadcn UI, Framer Motion
- **State Management**: Zustand
- **Validation**: Zod
- **DevOps**: Docker, Docker Compose

## Features

### Authentication
- User registration and login
- JWT-based authentication with access and refresh tokens
- Protected routes with middleware
- Secure password hashing with bcrypt

### Projects
- Create, read, update, and delete projects
- Project status management (active, archived, completed)
- Project member management
- Task statistics per project

### Tasks
- Create, read, update, and delete tasks
- Task assignment to team members
- Priority levels (low, medium, high)
- Status tracking (todo, in-progress, done)
- Due date management
- Drag-and-drop Kanban board

### Real-time Features
- Real-time task updates using Socket.io
- Live notifications for task assignments
- Project collaboration updates

### Dashboard
- Overview of total projects
- Total and completed tasks statistics
- Quick action links

## Project Structure

```
Project_Management_App/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── projects/[projectId]/page.tsx
│   │   ├── tasks/page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── me/route.ts
│   │   │   └── refresh/route.ts
│   │   ├── projects/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── tasks/
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   └── textarea.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Navbar.tsx
│   ├── project/
│   │   ├── ProjectCard.tsx
│   │   └── ProjectForm.tsx
│   └── task/
│       ├── TaskCard.tsx
│       ├── TaskForm.tsx
│       └── KanbanBoard.tsx
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   ├── socket.ts
│   ├── axios.ts
│   └── utils.ts
├── models/
│   ├── User.ts
│   ├── Project.ts
│   ├── Task.ts
│   └── Notification.ts
├── store/
│   ├── authStore.ts
│   ├── projectStore.ts
│   └── taskStore.ts
├── hooks/
│   ├── useAuth.ts
│   └── useSocket.ts
├── types/
│   ├── user.ts
│   ├── project.ts
│   ├── task.ts
│   └── notification.ts
├── middleware.ts
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 20+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Project_Management_App
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/project-management-saas
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

This will start:
- Next.js app on http://localhost:3000
- Socket.io server for real-time features

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Using Docker

1. Make sure Docker and Docker Compose are installed.

2. Create a `.env` file (copy from `.env.example`).

3. Run with Docker Compose:
```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Next.js app on port 3000

4. Stop the containers:
```bash
docker-compose down
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get project by ID
- `PUT /api/projects/[id]` - Update project (including members)
- `DELETE /api/projects/[id]` - Delete project

### Tasks
- `GET /api/tasks` - Get all tasks (with optional projectId query)
- `POST /api/tasks` - Create task (with assignment)
- `GET /api/tasks/[id]` - Get task by ID
- `PUT /api/tasks/[id]` - Update task (triggers notifications)
- `DELETE /api/tasks/[id]` - Delete task

### Users
- `GET /api/users` - Get all users (for team member selection)

### Notifications
- `GET /api/notifications` - Get user notifications with unread count
- `PUT /api/notifications` - Mark notification(s) as read

### Cron Jobs
- `GET /api/cron/check-deadlines` - Check task deadlines (automated)

## Security Features

- JWT-based authentication with access and refresh tokens
- HTTP-only cookies for token storage
- Password hashing with bcrypt
- Protected API routes with middleware
- Zod validation for all inputs
- CORS configuration for Socket.io

## Development

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Type checking:
```bash
npm run type-check
```

### Linting:
```bash
npm run lint
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/project-management-saas` |
| `JWT_SECRET` | Secret for access tokens | Required |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | Required |
| `JWT_EXPIRES_IN` | Access token expiration | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | `7d` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io server URL | `http://localhost:3000` |
| `NODE_ENV` | Environment | `development` |
| `CRON_SECRET` | Secret for cron job authentication | Required for production |

## Automated Tasks

### Deadline Checking
The application includes an automated cron job that checks for task deadlines every 6 hours:

- **Approaching Deadlines**: Sends notifications 24 hours before due date
- **Overdue Tasks**: Sends daily reminders for overdue tasks
- **Endpoint**: `/api/cron/check-deadlines`
- **Schedule**: Every 6 hours (configurable in `vercel.json`)

For local development, you can manually trigger the cron job:
```bash
curl -H "Authorization: Bearer your-cron-secret-key" http://localhost:3000/api/cron/check-deadlines
```

### Setting Up Cron Jobs

**For Vercel Deployment:**
- Cron jobs are automatically configured via `vercel.json`
- No additional setup required

**For Other Platforms:**
- Use external cron services (e.g., cron-job.org, EasyCron)
- Set up GitHub Actions workflow
- Use platform-specific cron features

## Notification System

### Browser Notifications
To enable browser notifications:
1. The app will request permission on first load
2. Grant notification permission in your browser
3. Receive real-time desktop notifications for:
   - Task assignments
   - Task completions
   - Deadline alerts

### In-App Notifications
- Real-time notification panel in the navbar
- Unread count badge
- Click notifications to navigate to relevant pages
- Mark individual or all notifications as read



## License

This project is licensed under the MIT License.


