'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
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

  // Build a lookup per edition for quick verse access
  const editionVerseMap: Record<string, Record<number, string>> = {};
  availableEditions.forEach((ed) => {
    const data = allData[ed];
    editionVerseMap[ed] = {};
    if (data?.verses) {
      data.verses.forEach((v) => {
        editionVerseMap[ed][v.verse] = v.text;
      });
    }
  });

  // Union of verse numbers across all editions
  const verseNumbers = Array.from(
    new Set(
      availableEditions.flatMap((ed) => allData[ed]?.verses.map((v) => v.verse) || [])
    )
  ).sort((a, b) => a - b);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />

      <div className="flex-1 flex">
        {/* Sidebar for chapters */}
        <Sidebar edition="simultaneous" currentBook={book} currentChapter={chapter} />

        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-5xl mx-auto mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {bookName} {chapter}
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-4">
              Compare all editions verse-by-verse
            </p>

            {/* Book and Chapter selectors (quick navigation) */}
            <div className="flex flex-wrap gap-3 mb-2">
              <select
                value={book}
                onChange={(e) => router.push(`/en/simultaneous/${e.target.value}/${chapter}`)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {chapters.map((ch) => (
                  <option key={ch} value={ch}>
                    Chapter {ch}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Verse-by-verse section with editions listed */}
          <div className="max-w-5xl mx-auto space-y-8">
            {verseNumbers.map((vNum) => (
              <section key={vNum} className="bg-white rounded-xl shadow-sm border border-gray-200">
                <header className="px-4 md:px-6 py-3 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                    {bookName} {chapter}:{vNum}
                  </h2>
                </header>
                <div className="p-4 md:p-6 space-y-3">
                  {availableEditions.map((ed) => (
                    <div key={ed} className="flex items-start gap-3">
                      <div className="shrink-0 w-14 md:w-16 text-right pr-2 font-semibold text-primary-700">
                        {ed}:
                      </div>
                      <div className="text-gray-800 leading-relaxed">
                        {editionVerseMap[ed][vNum] ?? '—'}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-2">
              {prevChapter ? (
                <button
                  onClick={() => router.push(`/en/simultaneous/${book}/${prevChapter}`)}
                  className="flex items-center gap-2 px-4 md:px-6 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
                  className="flex items-center gap-2 px-4 md:px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
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
    </div>
  );
}
