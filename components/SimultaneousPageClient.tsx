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
  const [edition, setEdition] = useState('simultaneous');
  const [allData, setAllData] = useState<Record<string, ChapterData>>(initialData);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true); // Always open on desktop
      } else {
        setSidebarOpen(false); // Closed by default on mobile
      }
    };

    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const chapters = getAllChapters(book);
  const bookName = getBookName(book);
  const prevChapter = chapter > 1 ? chapter - 1 : null;
  const nextChapter = chapter < chapters.length ? chapter + 1 : null;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleEditionChange = (newEdition: string) => {
    if (newEdition === 'simultaneous') {
      // Stay on simultaneous page
      return;
    }
    // Navigate to the regular edition reading route
    router.push(`/en/${newEdition}/${book}/${chapter}`);
  };

  // Available editions including simultaneous
  const availableEditions = ['simultaneous', ...EDITIONS];

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
        <TopBar 
          book={book} 
          chapter={chapter} 
          sidebarOpen={sidebarOpen}
          onSidebarToggle={toggleSidebar}
        />
        
        <main className="flex-1 p-8 flex items-center justify-center ml-0 md:ml-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading all editions...</p>
          </div>
        </main>
      </div>
    );
  }

  const availableDataEditions = EDITIONS.filter(ed => allData[ed]);

  // Build a lookup per edition for quick verse access
  const editionVerseMap: Record<string, Record<number, string>> = {};
  availableDataEditions.forEach((ed) => {
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
      availableDataEditions.flatMap((ed) => allData[ed]?.verses.map((v) => v.verse) || [])
    )
  ).sort((a, b) => a - b);

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar 
        edition={edition}
        book={book} 
        chapter={chapter} 
        sidebarOpen={sidebarOpen}
        onSidebarToggle={toggleSidebar}
        onEditionChange={handleEditionChange}
        availableEditions={availableEditions}
      />

      <div className="flex-1 flex">
        {/* Sidebar for chapters */}
        <Sidebar 
          edition="simultaneous" 
          currentBook={book} 
          currentChapter={chapter} 
          isOpen={sidebarOpen}
          onClose={closeSidebar}
        />

        <main className="flex-1 ml-0 md:ml-64 min-w-0">
          <div className="max-w-4xl px-6 md:px-8 py-8 mx-0 xl:mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 id="page-title" className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {bookName} {chapter}
              </h1>
              <p className="text-base md:text-lg text-gray-600">
                Compare all editions verse-by-verse
              </p>
            </div>

            {/* Verse-by-verse section with editions listed */}
            <div className="space-y-6">
              {verseNumbers.map((vNum) => (
                <section key={vNum} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <header className="px-4 md:px-6 py-3 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                      {bookName} {chapter}:{vNum}
                    </h2>
                  </header>
                  <div className="p-4 md:p-6 overflow-x-auto">
                    <pre className="text-sm md:text-base text-gray-800 leading-relaxed font-mono m-0">
                      {availableDataEditions
                        .map((ed) => `${ed}: ${editionVerseMap[ed][vNum] ?? '—'}`)
                        .join('\n')}
                    </pre>
                  </div>
                </section>
              ))}

              {/* Navigation */}
              <div className="flex justify-between items-center pt-4">
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
          </div>
        </main>
      </div>
    </div>
  );
}
