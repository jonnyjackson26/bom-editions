import { BOOKS, getBookName } from '@/lib/constants';
import { notFound, redirect } from 'next/navigation';

export function generateStaticParams() {
  return BOOKS.map((b) => ({ book: b.slug }));
}

export async function generateMetadata({ params }: { params: { book: string } }) {
  const name = getBookName(params.book);
  return {
    title: `${name} - Simultaneous View`,
    description: `Compare ${name} across all editions side by side.`,
  };
}

export default function SimultaneousBookIndex({ params }: { params: { book: string } }) {
  const { book } = params;
  const valid = BOOKS.find((b) => b.slug === book);
  if (!valid) {
    notFound();
  }
  redirect(`/en/simultaneous/${book}/1`);
}
