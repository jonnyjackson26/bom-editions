import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { EDITIONS, BOOKS, getAllChapters } from '@/lib/constants';
import { readFile } from 'fs/promises';
import path from 'path';
import { ChapterData } from '@/lib/data';
import { findChanges, ChangeItem } from '@/lib/diff';
import AllChangesClient from '@/components/AllChangesClient';

export const metadata = {
  title: 'All Changes - Book of Mormon Editions',
  description: 'View all textual changes made across all editions of the Book of Mormon from 1830 to 2013.',
};

async function getChapterData(edition: string, book: string, chapter: number): Promise<ChapterData | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'en', edition, book, `${chapter}.json`);
    const fileContent = await readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return null;
  }
}

async function loadAllChanges(): Promise<ChangeItem[]> {
  const allChanges: ChangeItem[] = [];

  // Compare each edition to the previous one
  for (let i = 1; i < EDITIONS.length; i++) {
    const fromEdition = EDITIONS[i - 1];
    const toEdition = EDITIONS[i];

    for (const book of BOOKS) {
      const chapters = getAllChapters(book.slug);
      
      for (const chapter of chapters) {
        const fromData = await getChapterData(fromEdition, book.slug, chapter);
        const toData = await getChapterData(toEdition, book.slug, chapter);

        if (fromData && toData) {
          const chapterChanges = findChanges(
            fromData,
            toData,
            book.name,
            chapter,
            fromEdition,
            toEdition
          );
          allChanges.push(...chapterChanges);
        }
      }
    }
  }

  return allChanges;
}

export default async function AllChangesPage() {
  const changes = await loadAllChanges();

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/changes" className="text-primary-600 hover:text-primary-700 font-medium mb-4 inline-block">
            ← Back to Changes Overview
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            All Changes Across Editions
          </h1>
        </div>

        <AllChangesClient initialChanges={changes} />
      </main>
    </div>
  );
}
