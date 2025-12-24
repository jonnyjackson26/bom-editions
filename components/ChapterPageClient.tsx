'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import { EDITIONS, getBookName, getAllChapters } from '@/lib/constants';
import { ChapterData, fetchChapterData, fetchAllEditionsForChapter } from '@/lib/data';
import { getDifferences, DiffResult } from '@/lib/diff';

interface ChapterPageClientProps {
  edition: string;
  book: string;
  chapter: number;
  initialData: ChapterData | null;
}

interface FootnoteData {
  verse: number;
  wordIndex: number;
  word: string;
  editions: Record<string, string>;
}

export default function ChapterPageClient({
  edition: initialEdition,
  book,
  chapter,
  initialData,
}: ChapterPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [edition, setEdition] = useState(initialEdition);
  const [showFootnotes, setShowFootnotes] = useState(searchParams.get('showFootnotes') === 'true');
  const [compareEdition, setCompareEdition] = useState(searchParams.get('compare') || '');
  const [chapterData, setChapterData] = useState<ChapterData | null>(initialData);
  const [compareData, setCompareData] = useState<ChapterData | null>(null);
  const [allEditionsData, setAllEditionsData] = useState<Record<string, ChapterData>>({});
  const [footnoteData, setFootnoteData] = useState<FootnoteData | null>(null);
  const [loading, setLoading] = useState(false);

  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (showFootnotes) params.set('showFootnotes', 'true');
    if (compareEdition) params.set('compare', compareEdition);
    return params.toString() ? `?${params.toString()}` : '';
  };

  const chapters = getAllChapters(book);
  const bookName = getBookName(book);
  const prevChapter = chapter > 1 ? chapter - 1 : null;
  const nextChapter = chapter < chapters.length ? chapter + 1 : null;

  // Update URL when controls change
  useEffect(() => {
    const params = new URLSearchParams();
    if (showFootnotes) params.set('showFootnotes', 'true');
    if (compareEdition) params.set('compare', compareEdition);
    const query = params.toString() ? `?${params.toString()}` : '';
    const newUrl = `/en/${edition}/${book}/${chapter}${query}`;
    router.push(newUrl, { scroll: false });
  }, [edition, showFootnotes, compareEdition, book, chapter, router]);

  // Fetch data when edition changes
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchChapterData(edition, book, chapter);
      setChapterData(data);
      
      if (compareEdition) {
        const compData = await fetchChapterData(compareEdition, book, chapter);
        setCompareData(compData);
      } else {
        setCompareData(null);
      }
      
      if (showFootnotes) {
        const allData = await fetchAllEditionsForChapter(book, chapter, EDITIONS as any);
        setAllEditionsData(allData);
      }
      
      setLoading(false);
    }
    
    loadData();
  }, [edition, book, chapter, compareEdition, showFootnotes]);

  const handleEditionChange = (newEdition: string) => {
    setEdition(newEdition);
    const params = new URLSearchParams();
    if (showFootnotes) params.set('showFootnotes', 'true');
    if (compareEdition) params.set('compare', compareEdition);
    const query = params.toString() ? `?${params.toString()}` : '';
    router.push(`/en/${newEdition}/${book}/${chapter}${query}`);
  };

  const handleWordClick = (verse: number, wordIndex: number, word: string) => {
    if (!showFootnotes) return;
    
    // Get the word from all editions for this verse
    const editionsText: Record<string, string> = {};
    
    Object.entries(allEditionsData).forEach(([ed, data]) => {
      const verseData = data.verses.find(v => v.verse === verse);
      if (verseData) {
        const words = verseData.text.split(/\s+/);
        const prevWord = words[wordIndex - 1] || '';
        const currWord = words[wordIndex] || '';
        const nextWord = words[wordIndex + 1] || '';
        editionsText[ed] = `${prevWord} [${currWord}] ${nextWord}`.trim();
      }
    });
    
    setFootnoteData({ verse, wordIndex, word, editions: editionsText });
  };

  const renderVerse = (verse: { verse: number; text: string }, compareVerse?: { verse: number; text: string }) => {
    let content: React.ReactNode;
    
    if (compareVerse && compareData) {
      // Show differences
      const diffs = getDifferences(verse.text, compareVerse.text);
      content = (
        <span className="verse-text">
          {diffs.map((diff, idx) => {
            if (diff.type === 'equal') return <span key={idx}>{diff.text}</span>;
            if (diff.type === 'delete') {
              return (
                <del key={idx} className="bg-red-100 text-red-700 line-through">
                  {diff.text}
                </del>
              );
            }
            if (diff.type === 'insert') {
              return (
                <ins key={idx} className="bg-green-100 text-green-700 no-underline font-medium">
                  {diff.text}
                </ins>
              );
            }
            return null;
          })}
        </span>
      );
    } else if (showFootnotes) {
      // Make words clickable
      const words = verse.text.split(/\s+/);
      content = (
        <span className="verse-text">
          {words.map((word, idx) => (
            <span key={idx}>
              <span
                onClick={() => handleWordClick(verse.verse, idx, word)}
                className="cursor-pointer hover:bg-primary-100 hover:text-primary-700 rounded px-0.5 transition-colors"
              >
                {word}
              </span>
              {idx < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </span>
      );
    } else {
      content = <span className="verse-text">{verse.text}</span>;
    }
    
    return (
      <div key={verse.verse} className="verse">
        <span className="verse-number">{verse.verse}</span>
        {content}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar
          edition={edition}
          showFootnotes={showFootnotes}
          compareEdition={compareEdition}
          onEditionChange={handleEditionChange}
          onShowFootnotesChange={setShowFootnotes}
          onCompareEditionChange={setCompareEdition}
          availableEditions={EDITIONS as any}
          book={book}
          chapter={chapter}
        />
        
        <div className="flex flex-1">
        <Sidebar edition={edition} currentBook={book} currentChapter={chapter} queryString={buildQueryString()} />
          
          <main className="flex-1 p-8 flex items-center justify-center ml-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading chapter...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!chapterData) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600">Chapter data not available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        edition={edition}
        showFootnotes={showFootnotes}
        compareEdition={compareEdition}
        onEditionChange={handleEditionChange}
        onShowFootnotesChange={setShowFootnotes}
        onCompareEditionChange={setCompareEdition}
        availableEditions={EDITIONS as any}
        book={book}
        chapter={chapter}
      />
      
      <div className="flex flex-1">
        <Sidebar edition={edition} currentBook={book} currentChapter={chapter} queryString={buildQueryString()} />
        
        <main className="flex-1 p-8 max-w-4xl mx-auto ml-64">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {bookName} {chapter}
            </h1>
            <p className="text-lg text-gray-600">
              {edition} Edition
              {compareEdition && ` (comparing to ${compareEdition})`}
            </p>
          </div>

          {/* Chapter Text */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-200">
            <div className="prose prose-lg max-w-none">
              {chapterData.verses.map((verse) => {
                const compareVerse = compareData?.verses.find(v => v.verse === verse.verse);
                return renderVerse(verse, compareVerse);
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            {prevChapter ? (
              <button
                onClick={() => {
                  const params = new URLSearchParams();
                  if (showFootnotes) params.set('showFootnotes', 'true');
                  if (compareEdition) params.set('compare', compareEdition);
                  const query = params.toString() ? `?${params.toString()}` : '';
                  router.push(`/en/${edition}/${book}/${prevChapter}${query}`);
                }}
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
                onClick={() => {
                  const params = new URLSearchParams();
                  if (showFootnotes) params.set('showFootnotes', 'true');
                  if (compareEdition) params.set('compare', compareEdition);
                  const query = params.toString() ? `?${params.toString()}` : '';
                  router.push(`/en/${edition}/${book}/${nextChapter}${query}`);
                }}
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
        </main>
      </div>

      {/* Footnote Popup */}
      {footnoteData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
             onClick={() => setFootnoteData(null)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
               onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Word Context: {footnoteData.word}
              </h3>
              <button
                onClick={() => setFootnoteData(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Verse {footnoteData.verse} - Across all editions</p>
            
            <div className="space-y-3">
              {Object.entries(footnoteData.editions).map(([ed, text]) => (
                <div key={ed} className="border-l-4 border-primary-500 pl-4 py-2 bg-gray-50 rounded">
                  <div className="font-bold text-primary-700 mb-1">{ed}</div>
                  <div className="text-gray-700">{text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
