'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BOOKS, getAllChapters, getBookName } from '@/lib/constants';
import LogoAndTitle from '@/components/LogoAndTitle';

interface SidebarProps {
  edition?: string;
  currentBook?: string;
  currentChapter?: number;
  queryString?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ edition, currentBook, currentChapter, queryString = '', isOpen = true, onClose }: SidebarProps) {
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
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-gray-200 overflow-y-auto fixed left-0 top-0 h-screen z-50 transform transition-transform duration-300 ease-in-out scroll-smooth [scrollbar-gutter:stable] ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:z-30`}>
        {/* Mobile Header - Close Button and Book/Chapter */}
        <div className="md:hidden sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="flex items-center justify-between px-4 h-16 gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Book and Chapter Display */}
            {currentBook && currentChapter && (
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-sm font-semibold text-gray-900 truncate">
                  {getBookName(currentBook)}
                </span>
                <span className="text-sm text-gray-600 flex-shrink-0">
                  {currentChapter}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Header - Logo and Title */}
        <div className="hidden md:block sticky top-0 bg-white border-b border-gray-200 z-10 hover:bg-gray-50 transition-colors">
          <div className="px-4 h-16 flex items-center">
            <LogoAndTitle 
              book={currentBook} 
              chapter={currentChapter} 
              edition={edition}
              isAtTop={false}
            />
          </div>
        </div>
        
        <div className="p-4 pb-8">
          {/* Back Home Button - Mobile Only, Sticky */}
          <div className="md:hidden sticky top-16 z-10 bg-white border-b border-gray-200 mb-4 pb-4">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </Link>
          </div>
          <nav className="space-y-1">
            {BOOKS.map((book) => {
              const isExpanded = expandedBooks.has(book.slug);
              const isActiveBook = currentBook === book.slug;
              const chapters = getAllChapters(book.slug);

              return (
                <div key={book.slug}>
                  <button
                    onClick={() => toggleBook(book.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActiveBook
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span>{book.name}</span>
                      <svg 
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : 'rotate-0'
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  
                  <div 
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: isExpanded ? '600px' : '0',
                      opacity: isExpanded ? 1 : 0
                    }}
                  >
                    <div className="mt-2 px-3 mb-2">
                      <div className="grid grid-cols-5 gap-1.5 p-2 bg-gray-50 rounded-lg">
                        {chapters.map((chapter) => {
                          const href = (edition
                            ? `/en/${edition}/${book.slug}/${chapter}`
                            : `/en/1830/${book.slug}/${chapter}`) + (queryString || '');
                          const isActiveChapter = currentBook === book.slug && currentChapter === chapter;

                          return (
                            <Link
                              key={chapter}
                              href={href}
                              onClick={(e) => {
                                onClose?.();
                                if (currentBook === book.slug && currentChapter === chapter) {
                                  e.preventDefault();
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                              }}
                              className={`flex items-center justify-center py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-200 ${
                                isActiveChapter
                                  ? 'bg-primary-600 text-white shadow-sm scale-105'
                                  : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-700 hover:scale-105 border border-gray-200'
                              }`}
                            >
                              {chapter}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
