"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import { BOOKS } from '@/lib/constants';

export default function EditionPageClient({ edition }: { edition: string }) {
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

  return (
    <>
      <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar 
          edition={edition} 
          mode="books" 
          queryString={queryString}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {edition} Edition
          </h1>
          <p className="text-lg text-gray-600">
            Select a book below to start reading the {edition} edition of the Book of Mormon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BOOKS.map((book) => (
            <Link
              key={book.slug}
              href={`/en/${edition}/${book.slug}${queryString}`}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-primary-500 group"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                {book.name}
              </h2>
              <p className="text-sm text-gray-500">
                Click to view chapters
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
    </>
  );
}
