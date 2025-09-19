# Deployment Guide

## Railway Deployment (Recommended)

Railway is perfect for this full-stack application as it can host both the tRPC server and Next.js client together.

### Prerequisites
1. GitHub account with your code pushed to a repository
2. Railway account (sign up at [railway.app](https://railway.app))

### Step 1: Prepare for Deployment
1. **Database**: Your SQLite database will work perfectly in production. Railway supports persistent storage for SQLite files.

2. **Environment Variables**: Set these in Railway:
   ```
   NODE_ENV=production
   PORT=3002
   DATABASE_URL=file:./database.db
   ```

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your trading-cards repository
4. Railway will automatically detect it's a Node.js project
5. Set environment variables in the Railway dashboard
6. Enable persistent storage for your SQLite database file

### Step 3: Database Setup
Your existing SQLite database will work perfectly:

1. **Persistent Storage**: Railway will maintain your `database.db` file between deployments
2. **Migrations**: Your existing Drizzle migrations will run automatically
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
