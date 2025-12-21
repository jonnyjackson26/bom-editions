import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { EDITIONS } from '@/lib/constants';

export const metadata = {
  title: 'Changes Between Editions - Book of Mormon',
  description: 'Explore textual changes made between different editions of the Book of Mormon from 1830 to 2013.',
};

export default function ChangesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      
      <main className="flex-1 max-w-5xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Edition Changes
          </h1>
          <p className="text-lg text-gray-600">
            Explore the textual changes made between different editions of the Book of Mormon over time. 
            Select an edition below to see what changed from the 1830 original, or view all changes across every edition.
          </p>
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
          {EDITIONS.slice(1).map((edition, index) => {
            const fromEdition = EDITIONS[0]; // Always compare from 1830
            
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
                <p className="text-gray-600">
                  View detailed textual changes and differences introduced in this edition
                </p>
              </Link>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-primary-50 rounded-xl p-8 border border-primary-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">About Edition Changes</h3>
          <p className="text-gray-700 mb-4">
            The Book of Mormon has undergone numerous revisions since its original publication in 1830. 
            These changes include corrections of typographical errors, grammatical improvements, 
            clarifications of meaning, and standardization of spelling and punctuation.
          </p>
          <p className="text-gray-700">
            Most changes were minor corrections, though some had theological significance. Understanding 
            these changes provides insight into the text's transmission history and the editorial decisions 
            made over time.
          </p>
        </div>
      </main>
    </div>
  );
}
