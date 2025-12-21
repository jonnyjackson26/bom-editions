import { BOOKS, getAllChapters, getBookName, EDITIONS } from '@/lib/constants';
import { notFound } from 'next/navigation';
import SimultaneousPageClient from '@/components/SimultaneousPageClient';
import { readFile } from 'fs/promises';
import path from 'path';
import { ChapterData } from '@/lib/data';

export async function generateStaticParams() {
  const params: { book: string; chapter: string }[] = [];
  
  BOOKS.forEach((book) => {
    const chapters = getAllChapters(book.slug);
    chapters.forEach((chapter) => {
      params.push({
        book: book.slug,
        chapter: chapter.toString(),
      });
    });
  });
  
  return params;
}

export async function generateMetadata({ 
  params 
}: { 
  params: { book: string; chapter: string } 
}) {
  const { book, chapter } = params;
  const bookName = getBookName(book);
  
  return {
    title: `${bookName} ${chapter} - All Editions`,
    description: `Compare ${bookName} chapter ${chapter} across all editions of the Book of Mormon simultaneously.`,
  };
}

async function getAllEditionsData(book: string, chapter: number): Promise<Record<string, ChapterData>> {
  const data: Record<string, ChapterData> = {};
  
  for (const edition of EDITIONS) {
    try {
      const filePath = path.join(process.cwd(), 'public', 'data', 'en', edition, book, `${chapter}.json`);
      const fileContent = await readFile(filePath, 'utf-8');
      data[edition] = JSON.parse(fileContent);
    } catch (error) {
      // Edition data not available
    }
  }
  
  return data;
}

export default async function SimultaneousPage({ 
  params 
}: { 
  params: { book: string; chapter: string } 
}) {
  const { book, chapter: chapterStr } = params;
  const chapter = parseInt(chapterStr, 10);

  const bookInfo = BOOKS.find((b) => b.slug === book);
  if (!bookInfo) {
    notFound();
  }

  if (isNaN(chapter) || chapter < 1) {
    notFound();
  }

  const initialData = await getAllEditionsData(book, chapter);

  return (
    <SimultaneousPageClient
      book={book}
      chapter={chapter}
      initialData={initialData}
    />
  );
}
