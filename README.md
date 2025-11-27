# Drafty - Ideas & Notes Platform

A modern web application for creating, organizing, and syncing notes and ideas with BuildOne account integration.

## Features

- **Create & Organize Notes**: Quickly capture and organize your thoughts
- **Auto Sync**: Notes sync automatically across devices
- **BuildOne Integration**: Secure login with BuildOne accounts
- **Tags & Organization**: Organize notes with custom tags
- **Real-time Updates**: Changes save automatically

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **State Management**: Zustand
- **Deployment**: Vercel
- **Authentication**: BuildOne OAuth + Local Auth

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
NEXT_PUBLIC_BUILDONE_API_URL=https://api.buildone.com
NEXT_PUBLIC_BUILDONE_CLIENT_ID=your_buildone_client_id
BUILDONE_CLIENT_SECRET=your_buildone_client_secret
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
```

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
- `POST /api/auth/buildone` - BuildOne OAuth
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
