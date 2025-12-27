'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { getBookName } from '@/lib/constants';
import LogoAndTitle from '@/components/LogoAndTitle';

export default function TopBar({
  edition,
  showFootnotes,
  compareEdition,
  onEditionChange,
  onShowFootnotesChange,
  onCompareEditionChange,
  availableEditions,
  book,
  chapter,
  sidebarOpen,
  onSidebarToggle,
}: {
  edition?: string;
  showFootnotes?: boolean;
  compareEdition?: string;
  onEditionChange?: (edition: string) => void;
  onShowFootnotesChange?: (show: boolean) => void;
  onCompareEditionChange?: (edition: string) => void;
  availableEditions?: string[];
  book?: string;
  chapter?: number;
  sidebarOpen?: boolean;
  onSidebarToggle?: () => void;
}) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Check if we're on a reading route
  const isReadingRoute = pathname.match(/^\/en\/(simultaneous\/[^/]+\/[^/]+|[^/]+\/[^/]+\/[^/]+)$/);

  useEffect(() => {
    if (!isReadingRoute) {
      setIsVisible(true);
      setIsAtTop(true);
      return;
    }

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Check if the page h1 is visible
          const pageH1 = document.getElementById('page-title');
          if (pageH1) {
            const rect = pageH1.getBoundingClientRect();
            // h1 is considered "at top" if it's still visible in viewport
            // 64px is the topbar height
            setIsAtTop(rect.bottom > 64);
          }
          
          // Always show when near top
          if (currentScrollY < 10) {
            setIsVisible(true);
          } 
          // Hide when scrolling down (with threshold to prevent jitter)
          else if (currentScrollY > lastScrollY.current + 5 && currentScrollY > 100) {
            setIsVisible(false);
          } 
          // Show when scrolling up (with threshold to prevent jitter)
          else if (currentScrollY < lastScrollY.current - 5) {
            setIsVisible(true);
          }
          
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isReadingRoute]);

  return (
    <div 
      className={`bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between px-4 h-16 gap-2">
        {/* Logo and Title / Hamburger Menu */}
        {isReadingRoute ? (
          <>
            <div className="flex items-center gap-2 min-w-0 flex-shrink md:hidden">
              {/* Mobile Hamburger Menu for reading routes */}
              <button
                onClick={onSidebarToggle}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors relative z-[60] flex-shrink-0"
                aria-label="Toggle sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {sidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              
              {/* Mobile Book and Chapter Display */}
              {book && chapter && (
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-semibold text-gray-900 truncate">
                    {getBookName(book)}
                  </span>
                  <span className="text-sm text-gray-600 flex-shrink-0">
                    {chapter}
                  </span>
                </div>
              )}
            </div>
            
            {/* Desktop Logo and Title for reading routes */}
            <LogoAndTitle 
              book={book} 
              chapter={chapter} 
              edition={edition} 
              isAtTop={isAtTop} 
              className="hidden md:flex" 
            />
          </>
        ) : (
          /* Regular Logo and Title for non-reading routes */
          <LogoAndTitle />
        )}

        {/* Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Edition Selector */}
          {edition && onEditionChange && availableEditions && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <label htmlFor="edition-select" className="text-xs sm:text-sm font-medium text-gray-700">
                Edition:
              </label>
              <select
                id="edition-select"
                value={edition}
                onChange={(e) => onEditionChange(e.target.value)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm shadow-sm hover:border-gray-400 transition-colors"
              >
                {availableEditions.map((ed) => (
                  <option key={ed} value={ed}>
                    {ed}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Show Footnotes Toggle - Commented out */}
          {/* {typeof showFootnotes !== 'undefined' && onShowFootnotesChange && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFootnotes}
                onChange={(e) => onShowFootnotesChange(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700 hidden md:inline">Footnotes</span>
            </label>
          )} */}

          {/* Compare Edition Selector */}
          {typeof compareEdition !== 'undefined' && onCompareEditionChange && availableEditions && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <label htmlFor="compare-select" className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                Compare to:
              </label>
              <select
                id="compare-select"
                value={compareEdition}
                onChange={(e) => onCompareEditionChange(e.target.value)}
                className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm shadow-sm hover:border-gray-400 transition-colors"
              >
                <option value="">None</option>
                {availableEditions
                  .filter((ed) => ed !== edition)
                  .map((ed) => (
                    <option key={ed} value={ed}>
                      {ed}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Navigation Links - Only on non-reading routes */}
          {!isReadingRoute && (
            <>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-2 ml-4 border-l pl-4">
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/changes"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname?.startsWith('/changes')
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Changes
                </Link>
                <Link
                  href="/about"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/about'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  About
                </Link>
              </div>

              {/* Mobile Hamburger Menu */}
              <div className="md:hidden ml-4 border-l pl-4">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Toggle menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {!isReadingRoute && isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-2 space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            <Link
              href="/changes"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname?.startsWith('/changes')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Changes
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/about'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
