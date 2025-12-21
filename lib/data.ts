export interface Verse {
  verse: number;
  text: string;
}

export interface ChapterData {
  book: string;
  chapter: number;
  edition: string;
  verses: Verse[];
}

export async function fetchChapterData(
  edition: string,
  book: string,
  chapter: number
): Promise<ChapterData | null> {
  try {
    const response = await fetch(`/data/en/${edition}/${book}/${chapter}.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching chapter data:', error);
    return null;
  }
}

export async function fetchAllEditionsForChapter(
  book: string,
  chapter: number,
  editions: string[]
): Promise<Record<string, ChapterData>> {
  const results = await Promise.all(
    editions.map(async (edition) => {
      const data = await fetchChapterData(edition, book, chapter);
      return { edition, data };
    })
  );

  return results.reduce((acc, { edition, data }) => {
    if (data) acc[edition] = data;
    return acc;
  }, {} as Record<string, ChapterData>);
}
