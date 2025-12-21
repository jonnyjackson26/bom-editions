import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import { EDITIONS, BOOKS, getAllChapters, getBookName } from '@/lib/constants';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const params: { edition: string; book: string }[] = [];
  
  EDITIONS.forEach((edition) => {
    BOOKS.forEach((book) => {
      params.push({
        edition,
        book: book.slug,
      });
    });
  });
  
  return params;
}

export async function generateMetadata({ params }: { params: { edition: string; book: string } }) {
  const { edition, book } = params;
  const bookName = getBookName(book);
  
  return {
    title: `${bookName} - ${edition} Edition`,
    description: `Read ${bookName} from the ${edition} edition of the Book of Mormon.`,
  };
}

export default function BookPage({ params }: { params: { edition: string; book: string } }) {
  const { edition, book } = params;

  if (!EDITIONS.includes(edition as any)) {
    notFound();
  }

  const bookInfo = BOOKS.find((b) => b.slug === book);
  if (!bookInfo) {
    notFound();
  }

  const chapters = getAllChapters(book);
  const bookName = getBookName(book);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      
      <div className="flex flex-1">
        <Sidebar edition={edition} currentBook={book} mode="chapters" />
        
        <main className="flex-1 p-8 max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="mb-4">
              <Link
                href={`/en/${edition}`}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                ← Back to {edition} Edition
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {bookName}
            </h1>
            <p className="text-lg text-gray-600">
              {edition} Edition - Select a chapter to begin reading
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Chapters</h2>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
              {chapters.map((chapter) => (
                <Link
                  key={chapter}
                  href={`/en/${edition}/${book}/${chapter}`}
                  className="flex items-center justify-center aspect-square bg-gray-100 hover:bg-primary-600 hover:text-white rounded-lg text-gray-900 font-semibold transition-all hover:shadow-md"
                >
                  {chapter}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-primary-50 rounded-xl p-6 border border-primary-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/en/${edition}/${book}/1`}
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Start Reading Chapter 1
              </Link>
              <Link
                href="/changes"
                className="inline-block bg-white hover:bg-gray-50 text-primary-600 font-medium px-4 py-2 rounded-lg border border-primary-600 transition-colors"
              >
                View Changes
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
