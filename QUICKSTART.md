# Quick Start Guide

## Local Development (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_BUILDONE_API_URL=https://api.buildone.com
NEXT_PUBLIC_BUILDONE_CLIENT_ID=test_client_id
BUILDONE_CLIENT_SECRET=test_secret
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=dev_secret_key
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open Browser
Visit `http://localhost:3000`

## Features to Try

### Sign Up
1. Click "Sign Up"
2. Enter email, password, and name
3. Create account

### Create Notes
1. Go to Dashboard
2. Click "+ New Note"
3. Add title and content
4. Click "Save"

### BuildOne Login
1. Click "Login with BuildOne"
2. Authenticate with BuildOne account
3. Auto-synced with BuildOne

### Sync Notes
1. Click "Sync" button
2. Notes sync across devices
3. Check last saved time

## File Structure

```
Drafty/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── NoteEditor.tsx   # Note editor
│   └── NoteList.tsx     # Notes list
├── lib/                 # Utilities
│   ├── api.ts          # API client
│   └── store.ts        # State management
├── public/             # Static files
├── package.json        # Dependencies
└── README.md          # Documentation
```

## Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Deploy to Vercel
vercel
```

## API Endpoints

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/buildone` - BuildOne OAuth

### Notes
- `GET /api/notes` - Get notes
- `POST /api/notes` - Create note
- `PUT /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note
- `POST /api/notes/sync` - Sync notes

## Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Clear cache
```bash
rm -rf .next
npm run dev
```

### Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Customize**: Update colors in `tailwind.config.js`
2. **Add Database**: Connect PostgreSQL or MongoDB
3. **Deploy**: Follow `DEPLOYMENT.md`
4. **Integrate**: Connect with BuildOne admin dashboard

## Support

- Documentation: See `README.md`
- Deployment: See `DEPLOYMENT.md`
- Issues: Check GitHub issues
