'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { EDITIONS, BOOKS, getAllChapters, getBookName } from '@/lib/constants';
import { ChapterData, fetchChapterData } from '@/lib/data';
import { findChanges, ChangeItem, renderDiffAsHTML } from '@/lib/diff';

export default function AllChangesPage() {
  const [changes, setChanges] = useState<ChangeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBook, setFilterBook] = useState<string>('');
  const [filterEdition, setFilterEdition] = useState<string>('');

  useEffect(() => {
    async function loadAllChanges() {
      const allChanges: ChangeItem[] = [];

      // Compare each edition to the previous one
      for (let i = 1; i < EDITIONS.length; i++) {
        const fromEdition = EDITIONS[i - 1];
        const toEdition = EDITIONS[i];

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
      }

      setChanges(allChanges);
      setLoading(false);
    }

    loadAllChanges();
  }, []);

  const filteredChanges = changes.filter((change) => {
    if (filterBook && change.book !== filterBook) return false;
    if (filterEdition && change.toEdition !== filterEdition) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar />
        
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600 mb-2">Loading all changes...</p>
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
            All Changes Across Editions
          </h1>
          <p className="text-lg text-gray-600">
            {changes.length} total changes found across all editions
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="filter-book" className="block text-sm font-medium text-gray-700 mb-2">
                Book
              </label>
              <select
                id="filter-book"
                value={filterBook}
                onChange={(e) => setFilterBook(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">All Books</option>
                {BOOKS.map((book) => (
                  <option key={book.slug} value={book.name}>
                    {book.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="filter-edition" className="block text-sm font-medium text-gray-700 mb-2">
                To Edition
              </label>
              <select
                id="filter-edition"
                value={filterEdition}
                onChange={(e) => setFilterEdition(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">All Editions</option>
                {EDITIONS.slice(1).map((edition) => (
                  <option key={edition} value={edition}>
                    {edition}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredChanges.length} of {changes.length} changes
          </div>
        </div>

        {/* Changes List */}
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
                  href={`/en/${change.toEdition}/${getBookName(change.book).toLowerCase().replace(/\s+/g, '-')}/${change.chapter}`}
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

        {filteredChanges.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-200">
            <p className="text-gray-600">No changes found matching your filters</p>
          </div>
        )}
      </main>
    </div>
  );
}
