import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { EDITIONS, BOOKS } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Book of Mormon Editions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore and compare different editions of the Book of Mormon from 1830 to 2013. 
            Read the original text, track changes across editions, and understand the evolution of this sacred text.
          </p>
        </div>

        {/* Editions Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Available Editions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EDITIONS.map((edition) => (
              <Link
                key={edition}
                href={`/en/${edition}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200 hover:border-primary-500"
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform">
                    {edition}
                  </div>
                  <div className="text-sm text-gray-500">Edition</div>
                  <div className="mt-4 text-primary-600 text-sm font-medium">
                    Read →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Read Any Edition</h3>
              <p className="text-gray-600">
                Access all major editions of the Book of Mormon from 1830 to 2013 in a clean, readable format.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Compare Editions</h3>
              <p className="text-gray-600">
                View differences between editions with highlighted changes, showing what was added, removed, or modified.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Track Changes</h3>
              <p className="text-gray-600">
                Browse a comprehensive list of all textual changes made between different editions over time.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-8 border border-primary-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/en/1830/1-nephi/1"
              className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="font-semibold text-gray-900 mb-1">Read the 1830 Edition</div>
              <div className="text-sm text-gray-600">Start with 1 Nephi Chapter 1</div>
            </Link>
            <Link
              href="/en/2013/1-nephi/1"
              className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="font-semibold text-gray-900 mb-1">Read the 2013 Edition</div>
              <div className="text-sm text-gray-600">Current LDS edition</div>
            </Link>
            <Link
              href="/changes"
              className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="font-semibold text-gray-900 mb-1">View All Changes</div>
              <div className="text-sm text-gray-600">See what changed between editions</div>
            </Link>
            <Link
              href="/en/simultaneous/1-nephi/1"
              className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="font-semibold text-gray-900 mb-1">Simultaneous View</div>
              <div className="text-sm text-gray-600">Compare all editions at once</div>
            </Link>
          </div>
        </section>

        {/* Books Overview */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Books in the Book of Mormon
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {BOOKS.map((book) => (
              <Link
                key={book.slug}
                href={`/en/2013/${book.slug}`}
                className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow border border-gray-200 hover:border-primary-500"
              >
                <div className="font-semibold text-gray-900 text-sm">{book.name}</div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 border-t border-gray-200 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          <p className="mb-2">
            Data sourced from{' '}
            <a
              href="https://github.com/BYU-ODH/OpenScripture"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              BYU Open Scripture
            </a>
          </p>
          <p className="text-sm">
            <Link href="/about" className="text-primary-600 hover:text-primary-700">
              Learn more about this project
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
