'use client';

import { useState, useMemo } from 'react';
import { BOOKS } from '@/lib/constants';
import {
  ChangeItem,
  DiffResult,
  computeChangeGroupsWithRanges,
  summarizeGroupChange,
} from '@/lib/diff';
import VirtualizedChangesList from './VirtualizedChangesList';

interface EditionChangesClientProps {
  initialChanges: ChangeItem[];
}

export default function EditionChangesClient({ initialChanges }: EditionChangesClientProps) {
  const [filterBook, setFilterBook] = useState<string>('');

  type PerDiffChange = ChangeItem & { groupDiffs: DiffResult[]; summary: string };

  // Expand verse-level changes into per-difference changes (memoized)
  const perDiffChanges: PerDiffChange[] = useMemo(() => {
    return initialChanges.flatMap((change) => {
      const groups = computeChangeGroupsWithRanges(change.diffs, change.oldText, change.newText);
      if (groups.length === 0) {
        return [{ ...change, groupDiffs: [], summary: 'No visible changes' }];
      }
      return groups.map((g) => ({
        ...change,
        groupDiffs: g.diffs,
        summary: summarizeGroupChange(change.oldText, change.newText, g),
      }));
    });
  }, [initialChanges]);

  const filteredChanges = useMemo(() => {
    return perDiffChanges.filter((change) => {
      if (filterBook && change.book !== filterBook) return false;
      return true;
    });
  }, [perDiffChanges, filterBook]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Compact Filter Bar */}
      <div className="mb-4 bg-white rounded-lg shadow-sm p-4 border border-gray-200 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">Showing:</span>
            <span>{filteredChanges.length.toLocaleString()} of {perDiffChanges.length.toLocaleString()}</span>
          </div>
          
          <div className="flex-1">
            <select
              value={filterBook}
              onChange={(e) => setFilterBook(e.target.value)}
              className="w-full sm:max-w-xs px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="">All Books</option>
              {BOOKS.map((book) => (
                <option key={book.slug} value={book.name}>
                  {book.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Virtualized Changes List */}
      {perDiffChanges.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-200">
          <p className="text-gray-600">No changes found between these editions</p>
        </div>
      ) : filteredChanges.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-200">
          <p className="text-gray-600">No changes found matching your filter</p>
        </div>
      ) : (
        <VirtualizedChangesList changes={filteredChanges} />
      )}
    </div>
  );
}
