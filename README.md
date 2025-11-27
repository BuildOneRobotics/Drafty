# Drafty - Ideas & Notes Platform

A modern web application for creating, organizing, and syncing notes and ideas with BuildOne account integration.

## Features

- **Create & Organize Notes**: Quickly capture and organize your thoughts
- **Auto Sync**: Notes sync automatically across devices
- **OAuth Integration**: Secure login with Google and GitHub
- **Tags & Organization**: Organize notes with custom tags
- **Real-time Updates**: Changes save automatically

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **State Management**: Zustand
- **Deployment**: Vercel
- **Authentication**: Supabase (Google, GitHub) + Local Auth

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Supabase Setup

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → API
4. Copy Project URL and anon key to `.env.local`
5. Go to Authentication → Providers
6. Enable Google and GitHub OAuth

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Deployment on Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
vercel
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- OAuth via Supabase (Google, GitHub)
- `GET /api/auth/me` - Get current user

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create note
- `PUT /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note
- `POST /api/notes/sync` - Sync notes

## Project Structure

```
app/
├── api/              # API routes
├── dashboard/        # Dashboard page
├── login/           # Login page
├── signup/          # Signup page
├── layout.tsx       # Root layout
└── page.tsx         # Home page

components/
├── NoteEditor.tsx   # Note editor component
└── NoteList.tsx     # Notes list component

lib/
├── api.ts           # API client
└── store.ts         # Zustand store
```

## License

Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
