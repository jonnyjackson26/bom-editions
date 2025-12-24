'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BOOKS, getAllChapters } from '@/lib/constants';

interface SidebarProps {
  edition?: string;
  currentBook?: string;
  currentChapter?: number;
  queryString?: string;
}

export default function Sidebar({ edition, currentBook, currentChapter, queryString = '' }: SidebarProps) {
  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(
    new Set(currentBook ? [currentBook] : [])
  );

  const toggleBook = (bookSlug: string) => {
    const newExpanded = new Set(expandedBooks);
    if (newExpanded.has(bookSlug)) {
      newExpanded.delete(bookSlug);
    } else {
      newExpanded.add(bookSlug);
    }
    setExpandedBooks(newExpanded);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto fixed left-0 top-0 h-screen pt-16">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Books
        </h2>
        <nav className="space-y-1">
          {BOOKS.map((book) => {
            const isExpanded = expandedBooks.has(book.slug);
            const isActiveBook = currentBook === book.slug;
            const chapters = getAllChapters(book.slug);

            return (
              <div key={book.slug}>
                <button
                  onClick={() => toggleBook(book.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActiveBook
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span>{book.name}</span>
                    <span className="text-xs">{isExpanded ? '▼' : '▶'}</span>
                  </span>
                </button>
                
                {isExpanded && (
                  <div className="mt-1 ml-3 grid grid-cols-4 gap-1 p-2">
                    {chapters.map((chapter) => {
                      const href = (edition
                        ? `/en/${edition}/${book.slug}/${chapter}`
                        : `/en/1830/${book.slug}/${chapter}`) + (queryString || '');
                      const isActiveChapter = currentBook === book.slug && currentChapter === chapter;

                      return (
                        <Link
                          key={chapter}
                          href={href}
                          className={`flex items-center justify-center px-1 py-1 rounded text-xs font-medium transition-colors ${
                            isActiveChapter
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {chapter}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
