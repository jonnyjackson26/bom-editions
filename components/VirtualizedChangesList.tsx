'use client';

import { useState, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import Link from 'next/link';
import { ChangeItem, renderDiffAsHTML, DiffResult } from '@/lib/diff';

interface VirtualizedChangesListProps {
  changes: Array<ChangeItem & { groupDiffs: DiffResult[]; summary: string }>;
}

export default function VirtualizedChangesList({ changes }: VirtualizedChangesListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: changes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72, // collapsed height
    overscan: 5,
  });

  if (changes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-200">
        <p className="text-gray-600">No changes found</p>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="overflow-auto rounded-lg flex-1"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const index = virtualRow.index;
          const change = changes[index];
          const isExpanded = expandedIndex === index;

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="pb-2"
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <button
                  onClick={(e) => {
                    if (typeof window !== 'undefined') {
                      const sel = window.getSelection?.();
                      if (sel && sel.toString()) {
                        return; // don't toggle when selecting text
                      }
                    }
                    setExpandedIndex(isExpanded ? null : index);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 mb-2">
                        <p className="text-sm font-medium text-gray-600" style={{ userSelect: 'text' }}>
                          {change.summary}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
