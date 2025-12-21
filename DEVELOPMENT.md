# Book of Mormon Editions - Development Guide

## Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
npm start
```

### Static Export
```bash
npm run build
```

The static files will be in the `out/` directory.

## Project Structure

```
bom-editions2/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Home page
│   ├── about/                   # About page
│   ├── changes/                 # Changes routes
│   │   ├── page.tsx            # Changes overview
│   │   ├── all/                # All changes
│   │   └── [edition]/          # Edition-specific changes
│   └── en/                     # Reading routes
│       ├── [edition]/          # Edition pages
│       │   ├── page.tsx        # Edition overview
│       │   └── [book]/         # Book pages
│       │       ├── page.tsx    # Book overview
│       │       └── [chapter]/  # Chapter reading
│       └── simultaneous/       # Simultaneous view
├── components/                  # React components
│   ├── TopBar.tsx              # Navigation bar with controls
│   ├── Sidebar.tsx             # Book/chapter navigation
│   ├── ChapterPageClient.tsx   # Chapter reading component
│   └── SimultaneousPageClient.tsx
├── lib/                        # Utility functions
│   ├── constants.ts            # Books, editions, chapters
│   ├── data.ts                 # Data fetching utilities
│   └── diff.ts                 # Text comparison utilities
└── public/
    └── data/                   # Scripture data
        └── en/                 # English editions
            ├── 1830/
            ├── 1837/
            └── ...

```

## Features

### Reading Interface
- **Sidebar Navigation**: Easy access to books and chapters
- **Top Bar Controls**: Switch editions, toggle footnotes, compare editions
- **Clean Reading Experience**: Optimized typography and spacing

### Edition Comparison
- **Inline Comparison**: View changes directly in the text with highlighting
- **Footnotes**: Click any word to see how it appears across all editions
- **Simultaneous View**: Read all editions side-by-side

### Change Tracking
- **All Changes**: Browse every textual change across editions
- **Edition-Specific**: View changes introduced in each edition
- **Filtering**: Filter by book or edition

## Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **diff-match-patch**: Text comparison library

## SEO Features

- Server-side rendering for all pages
- Proper meta tags and descriptions
- Semantic HTML structure
- Static generation for optimal performance

## Data Format

Chapter data is stored as JSON files:

```json
{
  "book": "1 Nephi",
  "chapter": 1,
  "edition": "1830",
  "verses": [
    {
      "verse": 1,
      "text": "I Nephi having been born..."
    }
  ]
}
```

## Routes

- `/` - Home page
- `/about` - About page
- `/en/[edition]` - Edition overview
- `/en/[edition]/[book]` - Book chapters
- `/en/[edition]/[book]/[chapter]` - Read chapter
- `/en/simultaneous/[book]/[chapter]` - All editions
- `/changes` - Changes overview
- `/changes/all` - All changes
- `/changes/[edition]` - Edition changes

## Query Parameters

- `?showFootnotes=true` - Enable word-by-word footnotes
- `?compare=1920` - Compare with another edition

