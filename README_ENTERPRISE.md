# 🚀 PRO - Enterprise Project Management SaaS

A production-ready, enterprise-grade project management platform built with Next.js 14, featuring role-based access control, team collaboration, real-time updates, and comprehensive activity tracking.

## ✨ Features

### Core Features
- ✅ **Project Management** - Create, update, and organize projects
- ✅ **Task Management** - Kanban board with drag-and-drop
- ✅ **Team Collaboration** - Invite members and assign roles
- ✅ **Real-time Updates** - Socket.io powered live updates
- ✅ **File Attachments** - Upload files to tasks (10MB limit)
- ✅ **Activity Logging** - Track all actions across the platform
- ✅ **Email Notifications** - Automated email alerts
- ✅ **Global Search** - Search across projects, tasks, and users
- ✅ **Dashboard Analytics** - Visual insights and statistics

### Enterprise Features
- 🔐 **Role-Based Access Control (RBAC)** - Admin and Member roles
- 👥 **Team Invitations** - Token-based secure invitations
- 📊 **Activity Logs** - Comprehensive audit trail
- 📧 **Email System** - Professional email templates
- 🔍 **Advanced Search** - Full-text search across entities
- 🎨 **Modern UI** - Cyan/teal theme with smooth animations
- 🔒 **Security** - JWT authentication, input validation, permission checks

## 🏗️ Architecture

### Tech Stack
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (access + refresh tokens)
- **Real-time:** Socket.io
- **State Management:** Zustand
- **Validation:** Zod
- **UI:** Tailwind CSS, Shadcn UI, Framer Motion
- **Email:** Nodemailer
- **DevOps:** Docker, GitHub Actions

### Project Structure
```
project-management-app/
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── (dashboard)/         # Protected dashboard pages
│   └── api/                 # API routes
│       ├── auth/            # Authentication endpoints
│       ├── projects/        # Project CRUD
│       ├── tasks/           # Task CRUD
│       ├── invitations/     # Team invitations
│       ├── activity/        # Activity logs
│       ├── upload/          # File uploads
│       ├── search/          # Global search
│       └── notifications/   # Notifications
├── components/
│   ├── layout/              # Layout components
│   ├── project/             # Project components
│   ├── task/                # Task components
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── auth.ts              # Authentication utilities
│   ├── rbac.ts              # Role-based access control
│   ├── rbacMiddleware.ts    # RBAC middleware
│   ├── activityLogger.ts    # Activity logging
│   ├── email.ts             # Email service
│   ├── db.ts                # Database connection
│   └── socket.ts            # Socket.io setup
├── models/
│   ├── User.ts              # User model
│   ├── Project.ts           # Project model
│   ├── Task.ts              # Task model
│   ├── Invitation.ts        # Invitation model
│   ├── ActivityLog.ts       # Activity log model
│   └── Notification.ts      # Notification model
├── types/                   # TypeScript type definitions
├── store/                   # Zustand stores
└── hooks/                   # Custom React hooks
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- SMTP credentials (Gmail, SendGrid, etc.)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Project_Management_App
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/project-management-saas

# JWT Secrets (generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

4. **Start MongoDB**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

## 👥 User Roles & Permissions

### Admin Role
- Create, update, and delete projects
- Invite members to projects
- Assign roles to members
- View all activity logs
- Access analytics dashboard
- Manage all tasks

### Member Role
- View assigned projects
- Create and update tasks
- Update tasks assigned to them
- View project activity
- Upload files to tasks

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use App Password in `SMTP_PASSWORD`

### SendGrid Setup
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

## 🔐 Security Features

### Authentication
- JWT-based authentication
- Access token (15 min expiry)
- Refresh token (7 days expiry)
- Secure HTTP-only cookies

### Authorization
- Role-based access control
- Permission checks at API level
- Project-level member roles
- Task-level access control

### Input Validation
- Zod schema validation
- File type and size validation
- SQL injection prevention
- XSS protection

## 📊 API Documentation

### Authentication
```typescript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
```

### Projects
```typescript
GET    /api/projects
POST   /api/projects
GET    /api/projects/[id]
PUT    /api/projects/[id]
DELETE /api/projects/[id]
```

### Tasks
```typescript
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/[id]
PUT    /api/tasks/[id]
DELETE /api/tasks/[id]
```

### Invitations
```typescript
POST /api/invitations          # Send invitation
GET  /api/invitations          # List invitations
POST /api/invitations/accept   # Accept invitation
```

### File Upload
```typescript
POST   /api/upload             # Upload file
DELETE /api/upload             # Delete file
```

### Activity Logs
```typescript
GET /api/activity              # Get activity logs
```

### Search
```typescript
GET /api/search?q=query&type=all
```

## 🐳 Docker Deployment

### Build and run with Docker Compose
```bash
docker-compose up -d
```

### Stop containers
```bash
docker-compose down
```

## 🚀 Production Deployment

### Vercel Deployment
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

**Note:** Socket.io requires custom server. Consider:
- Railway
- Render
- DigitalOcean
- AWS EC2

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=strong-random-secret
SMTP_HOST=smtp.sendgrid.net
```

## 🧪 Testing

### Run linter
```bash
npm run lint
```

### Type checking
```bash
npm run type-check
```

### Build for production
```bash
npm run build
```

## 📈 Performance Optimization

- Server-side rendering (SSR)
- Static generation where possible
- Image optimization
- Code splitting
- MongoDB indexing
- Connection pooling

## 🔧 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod
```

### Email Not Sending
- Verify SMTP credentials
- Check firewall settings
- Enable "Less secure app access" (Gmail)
- Use App Password instead of regular password

### File Upload Issues
- Check `public/uploads` directory exists
- Verify file permissions
- Check MAX_FILE_SIZE environment variable

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Nodemailer Documentation](https://nodemailer.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Open an issue on GitHub
- Email: support@pro-app.com
- Documentation: See `ENTERPRISE_UPGRADE.md`

---

**Built with ❤️ using Next.js 14 and TypeScript**
