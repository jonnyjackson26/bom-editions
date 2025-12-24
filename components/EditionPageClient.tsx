"use client";

import { useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function EditionPageClient({ edition }: { edition: string }) {
  const searchParams = useSearchParams();

  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (searchParams.get('showFootnotes') === 'true') params.set('showFootnotes', 'true');
    const compare = searchParams.get('compare');
    if (compare) params.set('compare', compare);
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  };
  const queryString = buildQueryString();

  return (
    <div className="flex flex-1">
      <Sidebar edition={edition} queryString={queryString} />

      <main className="flex-1 p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {edition} Edition
          </h1>
          <p className="text-lg text-gray-600">
            Select a book from the sidebar to start reading the {edition} edition of the Book of Mormon.
          </p>
        </div>

        <div className="bg-primary-50 rounded-xl p-6 border border-primary-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">About this Edition</h3>
          <p className="text-gray-700">
            Use the sidebar to browse books and chapters. Click on any book to expand and view its chapters.
          </p>
        </div>
      </main>
    </div>
  );
}
