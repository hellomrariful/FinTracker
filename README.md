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
2. Copy `.env.local.example` to `.env.local`
3. Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

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