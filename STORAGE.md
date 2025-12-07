# Drafty Storage System

## Overview
Drafty uses a **dual-storage system** for maximum reliability and data persistence.

## Storage Locations

### 1. Primary Storage: GitHub Gist (Cloud)
- **Location**: GitHub Gist via API
- **Configuration**: Set in `.env.local`
  - `GITHUB_TOKEN`: Your GitHub personal access token
  - `GIST_ID`: Your Gist ID for storing data
- **File**: `drafty-data.json` in your Gist
- **Access**: Via `/lib/gist.ts` API functions

### 2. Backup Storage: localStorage (Browser)
- **Location**: Browser's localStorage
- **Keys**:
  - `notebooks-{userId}`: User's notebooks
  - `notes-{userId}`: User's notes  
  - `flashcards-{userId}`: User's flashcards
  - `files-{userId}`: User's files
- **Purpose**: Fallback when API is unavailable

## How It Works

### Saving Data
1. **User makes changes** (types in editor, creates note, etc.)
2. **Debounced save** (1 second delay to avoid excessive API calls)
3. **Saves to GitHub Gist** via API
4. **Also saves to localStorage** as backup
5. **If API fails**, data is still saved locally

### Loading Data
1. **Attempts to load from GitHub Gist** first
2. **If API fails**, loads from localStorage
3. **Syncs periodically** (every 30 seconds on dashboard)

### Auto-Save Features
- **Notebooks**: Auto-saves 1 second after typing stops
- **Notes**: Auto-saves 1 second after typing stops
- **Flashcards**: Saves immediately on changes
- **Files**: Saves immediately on changes

## Data Structure

### GitHub Gist Format
```json
{
  "users": {},
  "notes": {
    "userId": [
      {
        "id": "timestamp",
        "title": "Note Title",
        "content": "<p>HTML content</p>",
        "tags": ["tag1", "tag2"],
        "createdAt": "ISO date",
        "updatedAt": "ISO date"
      }
    ]
  },
  "notebooks": {
    "userId": [
      {
        "id": "timestamp",
        "name": "Notebook Name",
        "folder": "optional folder",
        "pages": [
          {
            "id": "1",
            "number": 1,
            "title": "Page 1",
            "content": "<p>HTML content</p>"
          }
        ],
        "createdAt": "ISO date",
        "updatedAt": "ISO date"
      }
    ]
  },
  "flashcards": {
    "userId": [
      {
        "id": "timestamp",
        "title": "Flashcard Set",
        "cards": [
          {
            "id": "timestamp",
            "front": "Question",
            "back": "Answer"
          }
        ],
        "folder": "optional folder",
        "createdAt": "ISO date",
        "updatedAt": "ISO date"
      }
    ]
  },
  "whiteboards": {},
  "flashcardFolders": [],
  "files": []
}
```

## Setup Instructions

### 1. Create GitHub Gist
1. Go to https://gist.github.com
2. Create a new Gist
3. Name it `drafty-data.json`
4. Add initial content: `{}`
5. Copy the Gist ID from URL

### 2. Create GitHub Token
1. Go to GitHub Settings → Developer Settings → Personal Access Tokens
2. Generate new token (classic)
3. Select scope: `gist`
4. Copy the token

### 3. Configure Environment
Create `.env.local` in project root:
```env
GITHUB_TOKEN=your_github_token_here
GIST_ID=your_gist_id_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Benefits

### Reliability
- Data persists even if API is down
- Automatic fallback to local storage
- No data loss during network issues

### Performance
- Debounced saves reduce API calls
- Local storage provides instant access
- Background sync keeps data fresh

### User Experience
- Auto-save every 1 second
- Visual "Saving..." indicator
- No manual save button needed
- Works offline with localStorage

## Troubleshooting

### Data Not Saving
1. Check `.env.local` configuration
2. Verify GitHub token has `gist` scope
3. Check browser console for errors
4. Data should still save to localStorage

### Data Not Syncing
1. Check network connection
2. Verify Gist ID is correct
3. Check GitHub token hasn't expired
4. Manual sync available on dashboard

### Lost Data
1. Check localStorage in browser DevTools
2. Check GitHub Gist directly
3. Data is stored under user ID keys
4. Export data from localStorage if needed

## API Endpoints

- `GET /api/notes` - Load notes
- `POST /api/notes` - Create note
- `PUT /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note
- `GET /api/notebooks` - Load notebooks
- `POST /api/notebooks` - Create notebook
- `PUT /api/notebooks/[id]` - Update notebook
- `DELETE /api/notebooks/[id]` - Delete notebook
- `GET /api/flashcards` - Load flashcards
- `POST /api/flashcards` - Create flashcard set
- `PUT /api/flashcards/[id]` - Update flashcard set
- `DELETE /api/flashcards/[id]` - Delete flashcard set

## Security

- GitHub token stored server-side only
- User data isolated by user ID
- localStorage scoped to domain
- HTTPS recommended for production
