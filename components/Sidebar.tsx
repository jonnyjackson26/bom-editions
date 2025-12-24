'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BOOKS, getAllChapters } from '@/lib/constants';

interface SidebarProps {
  edition?: string;
  currentBook?: string;
  currentChapter?: number;
  mode?: 'books' | 'chapters';
  queryString?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ 
  edition, 
  currentBook, 
  currentChapter, 
  mode = 'books', 
  queryString = '',
  isOpen = true,
  onClose
}: SidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!mode || mode === 'books') {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && onClose && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
        
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 z-50 lg:z-0
          w-64 bg-white border-r border-gray-200 overflow-y-auto 
          h-[calc(100vh-4rem)]
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4">
            {/* Close button for mobile */}
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600"
                aria-label="Close sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Books
            </h2>
            <nav className="space-y-1">
              {BOOKS.map((book) => {
                const href = (edition
                  ? `/en/${edition}/${book.slug}`
                  : `/en/1830/${book.slug}`) + (queryString || '');
                const isActive = currentBook === book.slug;

                return (
                  <Link
                    key={book.slug}
                    href={href}
                    onClick={handleLinkClick}
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
      </>
    );
  }

  if (mode === 'chapters' && currentBook) {
    const chapters = getAllChapters(currentBook);
    const bookName = BOOKS.find((b) => b.slug === currentBook)?.name || currentBook;

    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && onClose && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
        
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 z-50 lg:z-0
          w-64 bg-white border-r border-gray-200 overflow-y-auto 
          h-[calc(100vh-4rem)]
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4">
            {/* Close button for mobile */}
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600"
                aria-label="Close sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            <div className="mb-4">
              <Link
                href={(edition ? `/en/${edition}` : '/') + (queryString || '')}
                onClick={handleLinkClick}
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
                const href = (edition
                  ? `/en/${edition}/${currentBook}/${chapter}`
                  : `/en/1830/${currentBook}/${chapter}`) + (queryString || '');
                const isActive = currentChapter === chapter;

                return (
                  <Link
                    key={chapter}
                    href={href}
                    onClick={handleLinkClick}
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
      </>
    );
  }

  return null;
}
