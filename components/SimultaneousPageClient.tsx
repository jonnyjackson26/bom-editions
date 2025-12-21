'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';
import { EDITIONS, getBookName, getAllChapters, BOOKS } from '@/lib/constants';
import { ChapterData, fetchAllEditionsForChapter } from '@/lib/data';

interface SimultaneousPageClientProps {
  book: string;
  chapter: number;
  initialData: Record<string, ChapterData>;
}

export default function SimultaneousPageClient({
  book,
  chapter,
  initialData,
}: SimultaneousPageClientProps) {
  const router = useRouter();
  const [allData, setAllData] = useState<Record<string, ChapterData>>(initialData);
  const [loading, setLoading] = useState(false);

  const chapters = getAllChapters(book);
  const bookName = getBookName(book);
  const prevChapter = chapter > 1 ? chapter - 1 : null;
  const nextChapter = chapter < chapters.length ? chapter + 1 : null;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchAllEditionsForChapter(book, chapter, EDITIONS as any);
      setAllData(data);
      setLoading(false);
    }
    
    if (Object.keys(initialData).length === 0) {
      loadData();
    }
  }, [book, chapter, initialData]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar />
        
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading all editions...</p>
          </div>
        </main>
      </div>
    );
  }

  const availableEditions = EDITIONS.filter(ed => allData[ed]);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {bookName} {chapter}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Simultaneous view - All editions side by side
          </p>

          {/* Book and Chapter Navigation */}
          <div className="flex gap-4 mb-4">
            <select
              value={book}
              onChange={(e) => router.push(`/en/simultaneous/${e.target.value}/${chapter}`)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              {BOOKS.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>

            <select
              value={chapter}
              onChange={(e) => router.push(`/en/simultaneous/${book}/${e.target.value}`)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              {chapters.map((ch) => (
                <option key={ch} value={ch}>
                  Chapter {ch}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Edition Columns */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {availableEditions.map((edition) => {
              const data = allData[edition];
              if (!data) return null;

              return (
                <div
                  key={edition}
                  className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                >
                  <div className="bg-primary-600 text-white p-4 sticky top-0 z-10">
                    <h2 className="text-xl font-bold">{edition}</h2>
                    <p className="text-sm opacity-90">Edition</p>
                  </div>
                  
                  <div className="p-6">
                    {data.verses.map((verse) => (
                      <div key={verse.verse} className="mb-4">
                        <span className="inline-block mr-2 font-semibold text-primary-600 min-w-[2rem]">
                          {verse.verse}
                        </span>
                        <span className="text-gray-700 leading-relaxed">
                          {verse.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            {prevChapter ? (
              <button
                onClick={() => router.push(`/en/simultaneous/${book}/${prevChapter}`)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous Chapter
              </button>
            ) : (
              <div></div>
            )}
            
            {nextChapter ? (
              <button
                onClick={() => router.push(`/en/simultaneous/${book}/${nextChapter}`)}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Next Chapter
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
