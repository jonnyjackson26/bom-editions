import Link from 'next/link';
import TopBar from '@/components/TopBar';
import Footer from '@/components/Footer';
import { EDITIONS, BOOKS, getAllChapters } from '@/lib/constants';
import { readFile } from 'fs/promises';
import path from 'path';
import { ChapterData } from '@/lib/data';
import { findChanges } from '@/lib/diff';

export const metadata = {
  title: 'Changes Between Editions - Book of Mormon',
  description: 'Explore textual changes made between different editions of the Book of Mormon from 1830 to 2013.',
};

async function getChapterData(edition: string, book: string, chapter: number): Promise<ChapterData | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'en', edition, book, `${chapter}.json`);
    const fileContent = await readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return null;
  }
}

async function getEditionChangeCount(fromEdition: string, toEdition: string): Promise<number> {
  let count = 0;

  for (const book of BOOKS) {
    const chapters = getAllChapters(book.slug);
    
    for (const chapter of chapters) {
      const fromData = await getChapterData(fromEdition, book.slug, chapter);
      const toData = await getChapterData(toEdition, book.slug, chapter);

      if (fromData && toData) {
        const chapterChanges = findChanges(
          fromData,
          toData,
          book.name,
          chapter,
          fromEdition,
          toEdition
        );
        count += chapterChanges.length;
      }
    }
  }

  return count;
}

export default async function ChangesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      
      <main className="flex-1 max-w-5xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Changes between Editions
          </h1>
          
          {/* Indicator - More above */}
          <div className="text-center text-gray-400 mb-4">
            <p className="text-sm">...</p>
          </div>
          
          {/* Example Change Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-4 py-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 mb-2">
                    <p className="text-sm font-medium text-gray-600">
                      Change &quot;to be&quot; to &quot;is&quot;
                    </p>
                    <p className="text-xs text-gray-500 flex-shrink-0">
                      (1 Nephi 1:3)
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 py-4 bg-gray-50">
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2 font-medium">Full Verse:</p>
                <div className="text-sm text-gray-700 leading-relaxed">
                  And I know that the record which I make, <del className="bg-red-100 text-red-700 line-through">to be</del><ins className="bg-green-100 text-green-700 no-underline">is</ins> true; and I make it with mine own hand; and I make it according to my knowledge.
                </div>
              </div>
              
              <a
                href="/en/1830/1-nephi/1?compare=1837"
                className="inline-block text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View in context →
              </a>
            </div>
          </div>
          
          {/* Indicator - More below */}
          <div className="text-center text-gray-400 mt-4 mb-8">
            <p className="text-sm">...</p>
          </div>
        </div>

        {/* All Changes Card */}
        <div className="mb-8">
          <Link
            href="/changes/all"
            className="block bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all p-8 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">View All Changes</h2>
                <p className="text-primary-100">
                  Browse every textual change across all editions from 1830 to 2013
                </p>
              </div>
              <svg
                className="w-8 h-8 group-hover:translate-x-2 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Individual Edition Changes */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Changes by Edition
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {await Promise.all(EDITIONS.slice(1).map(async (edition) => {
            const editionIndex = EDITIONS.indexOf(edition);
            const fromEdition = EDITIONS[editionIndex - 1];
            const changeCount = await getEditionChangeCount(fromEdition, edition);
            
            return (
              <Link
                key={edition}
                href={`/changes/${edition}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200 hover:border-primary-500 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {edition} Edition
                    </h3>
                    <p className="text-sm text-gray-500">
                      Changes from {fromEdition} to {edition}
                    </p>
                  </div>
                  <svg
                    className="w-6 h-6 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-primary-600">
                    {changeCount} {changeCount === 1 ? 'change' : 'changes'}
                  </p>
                </div>
              </Link>
            );
          }))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
