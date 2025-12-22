import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { BOOKS } from '@/lib/constants';

export const metadata = {
  title: 'Simultaneous View - All Editions',
  description: 'Compare all editions of any chapter side by side.',
};

export default function SimultaneousIndexPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <main className="flex-1 p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Simultaneous View</h1>
          <p className="text-lg text-gray-600">
            Pick a book to compare all editions verse-by-verse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BOOKS.map((book) => (
            <Link
              key={book.slug}
              href={`/en/simultaneous/${book.slug}`}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-primary-500 group"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {book.name}
              </h2>
              <p className="text-sm text-gray-500">Click to view chapters</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
