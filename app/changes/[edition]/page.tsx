import Link from 'next/link';
import TopBar from '@/components/TopBar';
import { EDITIONS, BOOKS, getAllChapters, getBookSlug } from '@/lib/constants';
import { notFound } from 'next/navigation';
import EditionChangesClient from '@/components/EditionChangesClient';
import { readFile } from 'fs/promises';
import path from 'path';
import { ChapterData } from '@/lib/data';
import { findChanges, ChangeItem } from '@/lib/diff';

export function generateStaticParams() {
  return EDITIONS.slice(1).map((edition) => ({
    edition,
  }));
}

export function generateMetadata({ params }: { params: { edition: string } }) {
  const { edition } = params;
  const editionIndex = EDITIONS.indexOf(edition as any);
  const previousEdition = editionIndex > 0 ? EDITIONS[editionIndex - 1] : EDITIONS[0];
  
  return {
    title: `Changes to ${edition} Edition - Book of Mormon`,
    description: `View all textual changes made to the ${edition} edition from the ${previousEdition} edition.`,
  };
}

async function getChapterData(edition: string, book: string, chapter: number): Promise<ChapterData | null> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'en', edition, book, `${chapter}.json`);
    const fileContent = await readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return null;
  }
}

async function loadEditionChanges(toEdition: string): Promise<ChangeItem[]> {
  const editionIndex = EDITIONS.indexOf(toEdition as any);
  const fromEdition = editionIndex > 0 ? EDITIONS[editionIndex - 1] : EDITIONS[0];
  const allChanges: ChangeItem[] = [];

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

  return allChanges;
}

export default async function EditionChangesPage({ params }: { params: { edition: string } }) {
  const { edition: toEdition } = params;

  if (!EDITIONS.includes(toEdition as any)) {
    notFound();
  }

  const changes = await loadEditionChanges(toEdition);
  const editionIndex = EDITIONS.indexOf(toEdition as any);
  const fromEdition = editionIndex > 0 ? EDITIONS[editionIndex - 1] : EDITIONS[0];

  const filteredChanges = changes.filter((change) => {
    return true; // Initial load with no filter
  });

  if (!EDITIONS.includes(toEdition as any)) {
    return notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/changes" className="text-primary-600 hover:text-primary-700 font-medium mb-4 inline-block">
            ← Back to Changes Overview
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Changes: {fromEdition} → {toEdition}
          </h1>
          <p className="text-lg text-gray-600">
            {changes.length} changes found between these editions
          </p>
        </div>

        <EditionChangesClient initialChanges={changes} />
      </main>
    </div>
  );
}
