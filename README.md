# Fintracker - Smart Financial Management

A comprehensive financial management platform built with Next.js, Supabase, and modern web technologies.

## Features

- **User Authentication**: Secure email/password authentication with Supabase Auth
- **Income Tracking**: Manage revenue streams and income sources
- **Expense Management**: Track and categorize business expenses
- **Asset Management**: Monitor physical and digital assets
- **Analytics Dashboard**: Real-time insights and financial analytics
- **Team Management**: Employee management and performance tracking
- **Responsive Design**: Works seamlessly across all devices

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Styling**: Tailwind CSS, shadcn/ui
- **Charts**: Recharts
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL with Row Level Security

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

3. Configure required environment variables:

   **Required Variables:**
   - `MONGODB_URI` - MongoDB connection string (local or Atlas)
   - `JWT_ACCESS_SECRET` - JWT access token secret (min 32 chars)
   - `JWT_REFRESH_SECRET` - JWT refresh token secret (min 32 chars)

   **Generate secure secrets:**
   ```bash
   # Generate JWT secrets
   openssl rand -base64 32
   ```

4. Validate your environment:
   ```bash
   npm run validate:env
   ```

5. Optional services (for full functionality):
   - Redis for caching: Set `REDIS_URL`
   - Email sending: Configure `SMTP_*` variables
   - File uploads: Set `BLOB_READ_WRITE_TOKEN` from Vercel

### Vercel Deployment Setup

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Project Settings:
   - All required variables from `.env.example`
   - Set `NODE_VERSION=20` for Node.js 20 LTS
4. Deploy

### Database Setup

1. Create a new Supabase project
2. Run the migration file in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor
3. Enable Row Level Security policies

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema

The application uses the following main tables:

- `profiles` - User profile information
- `employees` - Employee management
- `categories` - Income and expense categories  
- `income_transactions` - Income tracking
- `expense_transactions` - Expense tracking
- `assets` - Asset management

All tables include Row Level Security (RLS) policies to ensure data isolation between users.

## Authentication Flow

1. Users sign up with email/password
2. Profile is automatically created via database trigger
3. All data is isolated per user via RLS policies
4. Protected routes require authentication

## Demo Account

For testing purposes, you can use:
- Email: demo@fintracker.com
- Password: fintracker123

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.