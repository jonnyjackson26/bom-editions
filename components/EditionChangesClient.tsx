'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BOOKS } from '@/lib/constants';
import { ChangeItem, renderDiffAsHTML } from '@/lib/diff';

interface EditionChangesClientProps {
  initialChanges: ChangeItem[];
}

export default function EditionChangesClient({ initialChanges }: EditionChangesClientProps) {
  const [filterBook, setFilterBook] = useState<string>('');

  const filteredChanges = initialChanges.filter((change) => {
    if (filterBook && change.book !== filterBook) return false;
    return true;
  });

  return (
    <>
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
          Showing {filteredChanges.length} of {initialChanges.length} changes
        </div>
      </div>

      {/* Changes List */}
      {initialChanges.length === 0 ? (
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
                  href={`/en/${change.toEdition}/${change.book.toLowerCase().replace(/\s+/g, '-')}/${change.chapter}`}
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

      {filteredChanges.length === 0 && initialChanges.length > 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-200">
          <p className="text-gray-600">No changes found matching your filter</p>
        </div>
      )}
    </>
  );
}
