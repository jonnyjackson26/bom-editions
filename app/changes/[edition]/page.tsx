'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import TopBar from '@/components/TopBar';
import { EDITIONS, BOOKS, getAllChapters, getBookSlug } from '@/lib/constants';
import { fetchChapterData } from '@/lib/data';
import { findChanges, ChangeItem, renderDiffAsHTML } from '@/lib/diff';

export default function EditionChangesPage() {
  const params = useParams();
  const toEdition = params.edition as string;
  const fromEdition = EDITIONS[0]; // Always compare from 1830

  const [changes, setChanges] = useState<ChangeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBook, setFilterBook] = useState<string>('');

  useEffect(() => {
    async function loadChanges() {
      const allChanges: ChangeItem[] = [];

      for (const book of BOOKS) {
        const chapters = getAllChapters(book.slug);
        
        for (const chapter of chapters) {
          const fromData = await fetchChapterData(fromEdition, book.slug, chapter);
          const toData = await fetchChapterData(toEdition, book.slug, chapter);

          if (fromData && toData) {
            const chapterChanges = findChanges(
              fromData,
              toData,
              book.name,
              chapter,
              fromEdition,
              toEdition
            );
            allChanges.push(...chapterChanges);
          }
        }
      }

      setChanges(allChanges);
      setLoading(false);
    }

    if (EDITIONS.includes(toEdition as any)) {
      loadChanges();
    }
  }, [toEdition, fromEdition]);

  const filteredChanges = changes.filter((change) => {
    if (filterBook && change.book !== filterBook) return false;
    return true;
  });

  if (!EDITIONS.includes(toEdition as any)) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600">Edition not found</p>
            <Link href="/changes" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
              ← Back to Changes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar />
        
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600 mb-2">
              Loading changes from {fromEdition} to {toEdition}...
            </p>
            <p className="text-sm text-gray-500">This may take a moment</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/changes" className="text-primary-600 hover:text-primary-700 font-medium mb-4 inline-block">
            ← Back to Changes Overview
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Changes: {fromEdition} → {toEdition}
          </h1>
          <p className="text-lg text-gray-600">
            {changes.length} changes found between these editions
          </p>
        </div>

        {/* Filter */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Filter by Book</h2>
          <select
            value={filterBook}
            onChange={(e) => setFilterBook(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
          >
            <option value="">All Books</option>
            {BOOKS.map((book) => (
              <option key={book.slug} value={book.name}>
                {book.name}
              </option>
            ))}
          </select>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredChanges.length} of {changes.length} changes
          </div>
        </div>

        {/* Changes List */}
        {changes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-200">
            <p className="text-gray-600">No changes found between these editions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredChanges.map((change, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {change.book} {change.chapter}:{change.verse}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {change.fromEdition} → {change.toEdition}
                    </p>
                  </div>
                  <Link
                    href={`/en/${change.toEdition}/${getBookSlug(change.book)}/${change.chapter}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View in context →
                  </Link>
                </div>
                
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderDiffAsHTML(change.diffs) }}
                />
              </div>
            ))}
          </div>
        )}

        {filteredChanges.length === 0 && changes.length > 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-200">
            <p className="text-gray-600">No changes found matching your filter</p>
          </div>
        )}
      </main>
    </div>
  );
}
