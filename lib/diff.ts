import DiffMatchPatch from 'diff-match-patch';

const dmp = new DiffMatchPatch();

export interface DiffResult {
  type: 'equal' | 'insert' | 'delete';
  text: string;
}

export function getDifferences(text1: string, text2: string): DiffResult[] {
  const diffs = dmp.diff_main(text1, text2);
  dmp.diff_cleanupSemantic(diffs);

  return diffs.map(([type, text]) => ({
    type: type === 0 ? 'equal' : type === 1 ? 'insert' : 'delete',
    text,
  }));
}

export function renderDiffAsHTML(diffs: DiffResult[]): string {
  return diffs
    .map((diff) => {
      if (diff.type === 'equal') return diff.text;
      if (diff.type === 'delete') {
        return `<del class="bg-red-100 text-red-700 line-through">${diff.text}</del>`;
      }
      if (diff.type === 'insert') {
        return `<ins class="bg-green-100 text-green-700 no-underline">${diff.text}</ins>`;
      }
      return diff.text;
    })
    .join('');
}

export interface ChangeItem {
  book: string;
  chapter: number;
  verse: number;
  fromEdition: string;
  toEdition: string;
  oldText: string;
  newText: string;
  diffs: DiffResult[];
}

export function findChanges(
  fromData: { verses: { verse: number; text: string }[] },
  toData: { verses: { verse: number; text: string }[] },
  book: string,
  chapter: number,
  fromEdition: string,
  toEdition: string
): ChangeItem[] {
  const changes: ChangeItem[] = [];

  for (let i = 0; i < Math.max(fromData.verses.length, toData.verses.length); i++) {
    const fromVerse = fromData.verses[i];
    const toVerse = toData.verses[i];

    if (!fromVerse && toVerse) {
      // New verse added
      changes.push({
        book,
        chapter,
        verse: toVerse.verse,
        fromEdition,
        toEdition,
        oldText: '',
        newText: toVerse.text,
        diffs: [{ type: 'insert', text: toVerse.text }],
      });
    } else if (fromVerse && !toVerse) {
      // Verse removed
      changes.push({
        book,
        chapter,
        verse: fromVerse.verse,
        fromEdition,
        toEdition,
        oldText: fromVerse.text,
        newText: '',
        diffs: [{ type: 'delete', text: fromVerse.text }],
      });
    } else if (fromVerse && toVerse && fromVerse.text !== toVerse.text) {
      // Verse changed
      const diffs = getDifferences(fromVerse.text, toVerse.text);
      changes.push({
        book,
        chapter,
        verse: toVerse.verse,
        fromEdition,
        toEdition,
        oldText: fromVerse.text,
        newText: toVerse.text,
        diffs,
      });
    }
  }

  return changes;
}
