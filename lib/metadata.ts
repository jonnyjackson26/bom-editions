import { Metadata } from 'next';

export const baseMetadata: Metadata = {
  metadataBase: new URL('https://bom-editions.vercel.app'),
  title: {
    default: 'Book of Mormon Editions',
    template: '%s | Book of Mormon Editions',
  },
  description: 'Read and compare different editions of the Book of Mormon from 1830 to 2013. Track changes, view side-by-side comparisons, and explore the textual history.',
  keywords: [
    'Book of Mormon',
    'scripture',
    'editions',
    '1830',
    'religious texts',
    'comparison',
    'textual history',
    'LDS',
    'changes'
  ],
  authors: [{ name: 'Book of Mormon Editions Project' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Book of Mormon Editions',
    title: 'Book of Mormon Editions',
    description: 'Read and compare different editions of the Book of Mormon from 1830 to 2013',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book of Mormon Editions',
    description: 'Read and compare different editions of the Book of Mormon from 1830 to 2013',
  },
  robots: {
    index: true,
    follow: true,
  },
};
