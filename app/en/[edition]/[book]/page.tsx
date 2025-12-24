import { EDITIONS, BOOKS, getBookName } from '@/lib/constants';
import { notFound } from 'next/navigation';
import BookPageClient from '@/components/BookPageClient';

export async function generateStaticParams() {
  const params: { edition: string; book: string }[] = [];
  
  EDITIONS.forEach((edition) => {
    BOOKS.forEach((book) => {
      params.push({
        edition,
        book: book.slug,
      });
    });
  });
  
  return params;
}

export async function generateMetadata({ params }: { params: { edition: string; book: string } }) {
  const { edition, book } = params;
  const bookName = getBookName(book);
  
  return {
    title: `${bookName} - ${edition} Edition`,
    description: `Read ${bookName} from the ${edition} edition of the Book of Mormon.`,
  };
}

export default function BookPage({ params }: { params: { edition: string; book: string } }) {
  const { edition, book } = params;

  if (!EDITIONS.includes(edition as any)) {
    notFound();
  }

  // Book existence is validated implicitly by client component using constants

  return (
    <div className="min-h-screen flex flex-col">
      <BookPageClient edition={edition} book={book} />
    </div>
  );
}
