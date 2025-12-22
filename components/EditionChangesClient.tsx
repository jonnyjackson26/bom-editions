'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BOOKS } from '@/lib/constants';
import { ChangeItem, renderDiffAsHTML, DiffResult } from '@/lib/diff';

interface EditionChangesClientProps {
  initialChanges: ChangeItem[];
}

function extractChangeSummary(diffs: DiffResult[]): string {
  const changes = [];
  
  for (const diff of diffs) {
    if (diff.type !== 'equal') {
      changes.push({
        type: diff.type,
        text: diff.text.trim()
      });
    }
  }

  if (changes.length === 0) return 'No visible changes';
  
  // Try to show the most meaningful change
  if (changes.length === 1) {
    const change = changes[0];
    if (change.type === 'delete') {
      return `Removed "${change.text}"`;
    } else {
      return `Added "${change.text}"`;
    }
  }

  // For multiple changes, show first deletion and insertion
  const firstDelete = changes.find(c => c.type === 'delete');
  const firstInsert = changes.find(c => c.type === 'insert');

  if (firstDelete && firstInsert) {
    return `Change "${firstDelete.text}" to "${firstInsert.text}"`;
  }

  return `${changes.length} changes made`;
}

export default function EditionChangesClient({ initialChanges }: EditionChangesClientProps) {
  const [filterBook, setFilterBook] = useState<string>('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

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
        <div className="space-y-2">
          {filteredChanges.map((change, index) => {
            const changeSummary = extractChangeSummary(change.diffs);
            const isExpanded = expandedIndex === index;
            
            return (
              <div key={index} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 mb-2">
                        <p className="text-sm font-medium text-gray-600">
                          {changeSummary}
                        </p>
                        <p className="text-xs text-gray-500 flex-shrink-0">
                          ({change.book} {change.chapter}:{change.verse})
                        </p>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-200 px-4 py-4 bg-gray-50">
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2 font-medium">Full Verse:</p>
                      <div 
                        className="text-sm text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: renderDiffAsHTML(change.diffs) }}
                      />
                    </div>
                    
                    <Link
                      href={`/en/${change.toEdition}/${change.book.toLowerCase().replace(/\s+/g, '-')}/${change.chapter}`}
                      className="inline-block text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View in context →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
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
