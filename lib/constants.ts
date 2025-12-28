// Available editions in chronological order
export const EDITIONS = ['1830', '1837', '1840', '1841', '1879', '1920', '1981', '2013'] as const;

export type Edition = typeof EDITIONS[number];

// All edition options including simultaneous view
export const ALL_EDITION_OPTIONS = ['simultaneous', ...EDITIONS] as const;

export type EditionOption = typeof ALL_EDITION_OPTIONS[number];

// Book names and their URL slugs
export const BOOKS = [
  { name: '1 Nephi', slug: '1-nephi' },
  { name: '2 Nephi', slug: '2-nephi' },
  { name: 'Jacob', slug: 'jacob' },
  { name: 'Enos', slug: 'enos' },
  { name: 'Jarom', slug: 'jarom' },
  { name: 'Omni', slug: 'omni' },
  { name: 'Words of Mormon', slug: 'words-of-mormon' },
  { name: 'Mosiah', slug: 'mosiah' },
  { name: 'Alma', slug: 'alma' },
  { name: 'Helaman', slug: 'helaman' },
  { name: '3 Nephi', slug: '3-nephi' },
  { name: '4 Nephi', slug: '4-nephi' },
  { name: 'Mormon', slug: 'mormon' },
  { name: 'Ether', slug: 'ether' },
  { name: 'Moroni', slug: 'moroni' },
] as const;

// Chapter counts for each book
export const CHAPTER_COUNTS: Record<string, number> = {
  '1-nephi': 22,
  '2-nephi': 33,
  'jacob': 7,
  'enos': 1,
  'jarom': 1,
  'omni': 1,
  'words-of-mormon': 1,
  'mosiah': 29,
  'alma': 63,
  'helaman': 16,
  '3-nephi': 30,
  '4-nephi': 1,
  'mormon': 9,
  'ether': 15,
  'moroni': 10,
};

export function getBookName(slug: string): string {
  const book = BOOKS.find(b => b.slug === slug);
  return book?.name || slug;
}

export function getBookSlug(name: string): string {
  const book = BOOKS.find(b => b.name === name);
  return book?.slug || name.toLowerCase().replace(/\s+/g, '-');
}

export function getChapterCount(bookSlug: string): number {
  return CHAPTER_COUNTS[bookSlug] || 0;
}

export function getAllChapters(bookSlug: string): number[] {
  const count = getChapterCount(bookSlug);
  return Array.from({ length: count }, (_, i) => i + 1);
}
