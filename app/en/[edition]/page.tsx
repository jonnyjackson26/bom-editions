import { EDITIONS } from '@/lib/constants';
import { notFound } from 'next/navigation';
import EditionPageClient from '@/components/EditionPageClient';

export async function generateStaticParams() {
  return EDITIONS.map((edition) => ({
    edition,
  }));
}

export async function generateMetadata({ params }: { params: { edition: string } }) {
  const { edition } = params;
  
  return {
    title: `${edition} Edition - Book of Mormon`,
    description: `Read the ${edition} edition of the Book of Mormon with all books and chapters.`,
  };
}

export default function EditionPage({ params }: { params: { edition: string } }) {
  const { edition } = params;

  if (!EDITIONS.includes(edition as any)) {
    notFound();
  }


  return (
    <div className="min-h-screen flex flex-col">
      <EditionPageClient edition={edition} />
    </div>
  );
}
