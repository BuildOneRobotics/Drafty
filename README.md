# Drafty - Ideas & Notes Platform

A modern web application for creating, organizing, and syncing notes and ideas with BuildOne account integration.

## Features

- **Create & Organize Notes**: Quickly capture and organize your thoughts
- **Auto Sync**: Notes sync automatically across devices
- **Simple Authentication**: Email and password login
- **Tags & Organization**: Organize notes with custom tags
- **Real-time Updates**: Changes save automatically

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **State Management**: Zustand
- **Deployment**: Vercel
- **Storage**: GitHub Gist for data persistence

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
NEXT_PUBLIC_API_URL=http://localhost:3000
GITHUB_TOKEN=your_github_personal_access_token
GIST_ID=your_gist_id
```

### GitHub Gist Setup

1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Generate new token (classic) with `gist` scope
3. Create a new gist at [gist.github.com](https://gist.github.com)
4. Add file `drafty-data.json` with content: `{"users":{},"notes":{}}`
5. Copy gist ID from URL (e.g., `abc123def456`)
6. Add `GITHUB_TOKEN` and `GIST_ID` to `.env.local`

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
