import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import { EDITIONS, BOOKS } from '@/lib/constants';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return EDITIONS.map((edition) => ({
    edition,
  }));
}

export async function generateMetadata({ params }: { params: { edition: string } }) {
  const { edition } = params;
  
  return {
    title: `${edition} Edition - Book of Mormon`,
    description: `Read the ${edition} edition of the Book of Mormon with all books and chapters.`,
  };
}

export default function EditionPage({ params }: { params: { edition: string } }) {
  const { edition } = params;

  if (!EDITIONS.includes(edition as any)) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      
      <div className="flex flex-1">
        <Sidebar edition={edition} mode="books" />
        
        <main className="flex-1 p-8 max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {edition} Edition
            </h1>
            <p className="text-lg text-gray-600">
              Select a book below to start reading the {edition} edition of the Book of Mormon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BOOKS.map((book) => (
              <Link
                key={book.slug}
                href={`/en/${edition}/${book.slug}`}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-primary-500 group"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {book.name}
                </h2>
                <p className="text-sm text-gray-500">
                  Click to view chapters
                </p>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
