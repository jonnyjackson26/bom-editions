"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import { getAllChapters, getBookName } from '@/lib/constants';

export default function BookPageClient({ edition, book }: { edition: string; book: string }) {
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (searchParams.get('showFootnotes') === 'true') params.set('showFootnotes', 'true');
    const compare = searchParams.get('compare');
    if (compare) params.set('compare', compare);
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  };
  const queryString = buildQueryString();

  const chapters = getAllChapters(book);
  const bookName = getBookName(book);

  return (
    <>
      <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar 
          edition={edition} 
          currentBook={book} 
          mode="chapters" 
          queryString={queryString}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="mb-4">
            <Link
              href={`/en/${edition}${queryString}`}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to {edition} Edition
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {bookName}
          </h1>
          <p className="text-lg text-gray-600">
            {edition} Edition - Select a chapter to begin reading
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Chapters</h2>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
            {chapters.map((chapter) => (
              <Link
                key={chapter}
                href={`/en/${edition}/${book}/${chapter}${queryString}`}
                className="flex items-center justify-center aspect-square bg-gray-100 hover:bg-primary-600 hover:text-white rounded-lg text-gray-900 font-semibold transition-all hover:shadow-md"
              >
                {chapter}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-primary-50 rounded-xl p-6 border border-primary-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/en/${edition}/${book}/1${queryString}`}
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Start Reading Chapter 1
            </Link>
            <Link
              href="/changes"
              className="inline-block bg-white hover:bg-gray-50 text-primary-600 font-medium px-4 py-2 rounded-lg border border-primary-600 transition-colors"
            >
              View Changes
            </Link>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
