'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function TopBar({
  edition,
  showFootnotes,
  compareEdition,
  onEditionChange,
  onShowFootnotesChange,
  onCompareEditionChange,
  availableEditions,
  onMenuClick,
}: {
  edition?: string;
  showFootnotes?: boolean;
  compareEdition?: string;
  onEditionChange?: (edition: string) => void;
  onShowFootnotesChange?: (show: boolean) => void;
  onCompareEditionChange?: (edition: string) => void;
  availableEditions?: string[];
  onMenuClick?: () => void;
}) {
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Hamburger Menu Button (Mobile Only) */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Logo and Title - Hide logo on mobile */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="hidden md:flex w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              Book of Mormon Editions
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">Compare editions from 1830-2013</p>
          </div>
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Edition Selector */}
          {edition && onEditionChange && availableEditions && (
            <div className="flex items-center gap-1 md:gap-2">
              <label htmlFor="edition-select" className="text-sm font-medium text-gray-700 hidden sm:inline">
                Edition:
              </label>
              <select
                id="edition-select"
                value={edition}
                onChange={(e) => onEditionChange(e.target.value)}
                className="px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-xs md:text-sm"
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
            <div className="flex items-center gap-1 md:gap-2">
              <label htmlFor="compare-select" className="text-sm font-medium text-gray-700 hidden sm:inline">
                Compare to:
              </label>
              <select
                id="compare-select"
                value={compareEdition}
                onChange={(e) => onCompareEditionChange(e.target.value)}
                className="px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-xs md:text-sm"
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-2 ml-4 border-l pl-4">
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

      {/* Mobile Navigation Menu Dropdown */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-2 space-y-1">
            <Link
              href="/"
              onClick={() => setShowMobileMenu(false)}
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
              onClick={() => setShowMobileMenu(false)}
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
              onClick={() => setShowMobileMenu(false)}
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
