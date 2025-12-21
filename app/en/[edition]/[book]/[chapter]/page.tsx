import { EDITIONS, BOOKS, getAllChapters, getBookName } from '@/lib/constants';
import { notFound } from 'next/navigation';
import ChapterPageClient from '@/components/ChapterPageClient';
import { readFile } from 'fs/promises';
import path from 'path';

export async function generateStaticParams() {
  const params: { edition: string; book: string; chapter: string }[] = [];
  
  EDITIONS.forEach((edition) => {
    BOOKS.forEach((book) => {
      const chapters = getAllChapters(book.slug);
      chapters.forEach((chapter) => {
        params.push({
          edition,
          book: book.slug,
          chapter: chapter.toString(),
        });
      });
    });
  });
  
  return params;
}

export async function generateMetadata({ 
  params 
}: { 
  params: { edition: string; book: string; chapter: string } 
}) {
  const { edition, book, chapter } = params;
  const bookName = getBookName(book);
  
  return {
    title: `${bookName} ${chapter} - ${edition} Edition`,
    description: `Read ${bookName} chapter ${chapter} from the ${edition} edition of the Book of Mormon.`,
  };
}

async function getChapterData(edition: string, book: string, chapter: number) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'en', edition, book, `${chapter}.json`);
    const fileContent = await readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    return null;
  }
}

export default async function ChapterPage({ 
  params 
}: { 
  params: { edition: string; book: string; chapter: string } 
}) {
  const { edition, book, chapter: chapterStr } = params;
  const chapter = parseInt(chapterStr, 10);

  if (!EDITIONS.includes(edition as any)) {
    notFound();
  }

  const bookInfo = BOOKS.find((b) => b.slug === book);
  if (!bookInfo) {
    notFound();
  }

  if (isNaN(chapter) || chapter < 1) {
    notFound();
  }

  const initialData = await getChapterData(edition, book, chapter);

  return (
    <ChapterPageClient
      edition={edition}
      book={book}
      chapter={chapter}
      initialData={initialData}
    />
  );
}
