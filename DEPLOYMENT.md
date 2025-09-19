# Deployment Guide

## Railway Deployment (Recommended)

Railway is perfect for this full-stack application and CAN deploy both frontend and backend together in a single service.

### Prerequisites
1. GitHub account with your code pushed to a repository
2. Railway account (sign up at [railway.app](https://railway.app))

### Step 1: Deploy Full-Stack Application
1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your trading-cards repository
4. Railway will automatically detect it's a Node.js project and build both client and server
5. Set these environment variables in Railway:
   ```
   NODE_ENV=production
   DATABASE_URL=file:./database.db
   BACKEND_PORT=3002
   FRONTEND_PORT=3000
   NEXT_PUBLIC_BACKEND_PORT=3002
   ```
6. **Important**: Railway will automatically assign a PORT - don't set it manually
7. Enable persistent storage for your SQLite database file
8. Your full application will be available at: `https://your-app-name.up.railway.app`

### Step 2: How It Works
- Railway runs `npm run build` which builds both the Next.js client and TypeScript server
- Railway runs `npm start` which starts both the tRPC server (BACKEND_PORT) and Next.js client (FRONTEND_PORT) using `concurrently`
- The Next.js client automatically detects it's in production and connects to the tRPC server on the same domain
- Both services run simultaneously in the same Railway container

### Step 3: Test the Application
1. Visit your Railway URL
2. You should see your Next.js frontend
3. The app should automatically connect to the tRPC backend running on the same domain
4. Check the Network tab in browser dev tools to see API calls

### Step 3: Database Setup
Your existing SQLite database will work perfectly:

1. **Persistent Storage**: Railway will maintain your `database.db` file between deployments
2. **Migrations**: Your database setup script will run automatically on startup
3. **No Changes Needed**: Your current database configuration is production-ready

## Alternative: Render Deployment

### Step 1: Create Render Services
1. **Backend Service**:
   - Build Command: `npm run build`
   - Start Command: `npm run server`
   - Environment: Node.js

2. **Frontend Service**:
   - Build Command: `cd client && npm run build`
   - Start Command: `cd client && npm run start`
   - Environment: Node.js

### Step 2: Database
- Enable persistent disk storage for SQLite database
- Set DATABASE_URL environment variable to `file:./database.db`

## Alternative: Vercel + Railway Hybrid

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel
2. Set build settings:
   - Framework: Next.js
   - Root Directory: `client`
   - Build Command: `npm run build`

### Backend (Railway)
1. Deploy only the server part to Railway
2. Update the frontend's API URL to point to Railway backend

## Environment Variables Needed

### Production Environment Variables:
```
NODE_ENV=production
PORT=3002
DATABASE_URL=file:./database.db
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

## SQLite in Production

Your SQLite database is perfectly suited for production deployment:

### Benefits:
- **Zero Configuration**: No database server setup required
- **Fast Performance**: Excellent for read-heavy workloads like your trading cards app
- **Reliability**: SQLite is battle-tested and used by many production applications
- **Backup Simplicity**: Just copy the database.db file
- **Cost Effective**: No database hosting fees

### Considerations:
- **Concurrent Writes**: SQLite handles multiple readers but serializes writes
- **File Storage**: Ensure your hosting platform provides persistent storage
- **Backups**: Set up regular backups of your database.db file

Your current setup is production-ready! Just deploy and go.
