'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { getBookName } from '@/lib/constants';

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
}) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
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
          
          // Don't hide if we're at the top
          if (currentScrollY < 10) {
            setIsVisible(true);
          } 
          // Hide when scrolling down
          else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setIsVisible(false);
          } 
          // Show when scrolling up
          else if (currentScrollY < lastScrollY.current) {
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
      className={`bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between px-4 h-16">
        {/* Logo and Title */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <div>
            {isReadingRoute && book && chapter ? (
              <>
                {isAtTop ? (
                  <>
                    <h1 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      Book of Mormon Editions
                    </h1>
                    <p className="text-xs text-gray-500 hidden sm:block">Compare editions from 1830-2013</p>
                  </>
                ) : (
                  <>
                    <h1 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {getBookName(book)} {chapter}
                    </h1>
                    <p className="text-xs text-gray-500 hidden sm:block">{edition} Edition</p>
                  </>
                )}
              </>
            ) : (
              <>
                <h1 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                  Book of Mormon Editions
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Compare editions from 1830-2013</p>
              </>
            )}
          </div>
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Edition Selector */}
          {edition && onEditionChange && availableEditions && (
            <div className="flex items-center gap-2">
              <label htmlFor="edition-select" className="text-sm font-medium text-gray-700 hidden sm:inline">
                Edition:
              </label>
              <select
                id="edition-select"
                value={edition}
                onChange={(e) => onEditionChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm"
              >
                {availableEditions.map((ed) => (
                  <option key={ed} value={ed}>
                    {ed}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Show Footnotes Toggle */}
          {typeof showFootnotes !== 'undefined' && onShowFootnotesChange && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFootnotes}
                onChange={(e) => onShowFootnotesChange(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700 hidden md:inline">Footnotes</span>
            </label>
          )}

          {/* Compare Edition Selector */}
          {typeof compareEdition !== 'undefined' && onCompareEditionChange && availableEditions && (
            <div className="flex items-center gap-2">
              <label htmlFor="compare-select" className="text-sm font-medium text-gray-700 hidden sm:inline">
                Compare to:
              </label>
              <select
                id="compare-select"
                value={compareEdition}
                onChange={(e) => onCompareEditionChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm"
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

          {/* Navigation Links */}
          <div className="flex items-center gap-2 ml-4 border-l pl-4">
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
        </div>
      </div>
    </div>
  );
}
