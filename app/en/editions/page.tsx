import TopBar from '@/components/TopBar';
import { EDITIONS } from '@/lib/constants';
import Link from 'next/link';

export const metadata = {
  title: 'All Editions - Book of Mormon',
  description: 'Browse all available editions of the Book of Mormon and their changes.',
};

export default function EditionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      
      <main className="flex-1 max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            All Editions
          </h1>
          <p className="text-lg text-gray-600">
            Browse all available editions of the Book of Mormon. Start reading any edition or view the changes from the previous edition.
          </p>
        </div>

        <div className="space-y-4">
          {EDITIONS.map((edition, index) => {
            const prevEdition = index > 0 ? EDITIONS[index - 1] : null;
            
            return (
              <div
                key={edition}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:border-primary-500 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {edition} Edition
                    </h2>
                    {prevEdition && (
                      <p className="text-sm text-gray-600">
                        Previous edition: {prevEdition}
                      </p>
                    )}
                    {!prevEdition && (
                      <p className="text-sm text-gray-600">
                        Original edition
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/en/${edition}/1-nephi/1`}
                      className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                    >
                      Start Reading
                    </Link>
                    
                    {prevEdition && (
                      <Link
                        href={`/changes/${edition}`}
                        className="inline-block bg-white hover:bg-gray-50 text-primary-600 font-medium px-6 py-3 rounded-lg border border-primary-600 transition-colors"
                      >
                        View Changes from {prevEdition}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-primary-50 rounded-xl p-6 border border-primary-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">About These Editions</h3>
          <p className="text-gray-700">
            Each edition represents a published version of the Book of Mormon. Changes between editions 
            include corrections, clarifications, and updates to punctuation, spelling, and grammar. 
            Use the comparison tools to explore how the text has evolved over time.
          </p>
        </div>
      </main>
    </div>
  );
}
