'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BOOKS, getAllChapters } from '@/lib/constants';

interface SidebarProps {
  edition?: string;
  currentBook?: string;
  currentChapter?: number;
  mode?: 'books' | 'chapters';
}

export default function Sidebar({ edition, currentBook, currentChapter, mode = 'books' }: SidebarProps) {
  const pathname = usePathname();

  if (!mode || mode === 'books') {
    return (
      <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)]">
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Books
          </h2>
          <nav className="space-y-1">
            {BOOKS.map((book) => {
              const href = edition
                ? `/en/${edition}/${book.slug}`
                : `/en/1830/${book.slug}`;
              const isActive = currentBook === book.slug;

              return (
                <Link
                  key={book.slug}
                  href={href}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {book.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    );
  }

  if (mode === 'chapters' && currentBook) {
    const chapters = getAllChapters(currentBook);
    const bookName = BOOKS.find((b) => b.slug === currentBook)?.name || currentBook;

    return (
      <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto sticky top-16 h-[calc(100vh-4rem)]">
        <div className="p-4">
          <div className="mb-4">
            <Link
              href={edition ? `/en/${edition}` : '/'}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              ← All Books
            </Link>
          </div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {bookName}
          </h2>
          <nav className="grid grid-cols-4 gap-2">
            {chapters.map((chapter) => {
              const href = edition
                ? `/en/${edition}/${currentBook}/${chapter}`
                : `/en/1830/${currentBook}/${chapter}`;
              const isActive = currentChapter === chapter;

              return (
                <Link
                  key={chapter}
                  href={href}
                  className={`flex items-center justify-center px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {chapter}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    );
  }

  return null;
}
