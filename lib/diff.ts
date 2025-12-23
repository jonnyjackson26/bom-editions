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

// Split a verse-level diff array into individual change groups (runs of non-equal ops)
export function splitChangeGroups(diffs: DiffResult[]): DiffResult[][] {
  const groups: DiffResult[][] = [];
  let current: DiffResult[] = [];

  for (const d of diffs) {
    if (d.type === 'equal') {
      if (current.length > 0) {
        groups.push(current);
        current = [];
      }
    } else {
      current.push(d);
    }
  }

  if (current.length > 0) groups.push(current);
  return groups;
}

export function countChangeGroups(diffs: DiffResult[]): number {
  return splitChangeGroups(diffs).length;
}

export interface ChangeGroupRange {
  diffs: DiffResult[];
  oldStart: number;
  oldEnd: number;
  newStart: number;
  newEnd: number;
}

// Compute contiguous non-equal groups and their ranges within old/new verse strings
export function computeChangeGroupsWithRanges(
  diffs: DiffResult[],
  oldText: string,
  newText: string
): ChangeGroupRange[] {
  const groups: ChangeGroupRange[] = [];
  let oldPos = 0;
  let newPos = 0;

  let currentDiffs: DiffResult[] = [];
  let groupOldStart = 0;
  let groupNewStart = 0;
  let inGroup = false;

  for (const d of diffs) {
    if (d.type === 'equal') {
      if (inGroup) {
        groups.push({
          diffs: currentDiffs,
          oldStart: groupOldStart,
          oldEnd: oldPos,
          newStart: groupNewStart,
          newEnd: newPos,
        });
        currentDiffs = [];
        inGroup = false;
      }
      oldPos += d.text.length;
      newPos += d.text.length;
    } else if (d.type === 'delete') {
      if (!inGroup) {
        groupOldStart = oldPos;
        groupNewStart = newPos;
        inGroup = true;
      }
      currentDiffs.push(d);
      oldPos += d.text.length;
    } else if (d.type === 'insert') {
      if (!inGroup) {
        groupOldStart = oldPos;
        groupNewStart = newPos;
        inGroup = true;
      }
      currentDiffs.push(d);
      newPos += d.text.length;
    }
  }

  if (inGroup) {
    groups.push({
      diffs: currentDiffs,
      oldStart: groupOldStart,
      oldEnd: oldPos,
      newStart: groupNewStart,
      newEnd: newPos,
    });
  }

  return groups;
}

function isWordChar(ch: string): boolean {
  // ES5-safe: treat letters, digits, apostrophes, and dashes as word chars
  return /[A-Za-z0-9_'’-]/.test(ch);
}

function expandToWordBoundaries(text: string, start: number, end: number): [number, number] {
  let s = Math.max(0, start);
  let e = Math.min(text.length, end);

  while (s > 0 && isWordChar(text[s - 1])) s--;
  while (e < text.length && isWordChar(text[e])) e++;
  return [s, e];
}

export function summarizeGroupChange(
  oldText: string,
  newText: string,
  group: ChangeGroupRange
): string {
  const hasDelete = group.diffs.some((d) => d.type === 'delete');
  const hasInsert = group.diffs.some((d) => d.type === 'insert');

  const [oldS, oldE] = expandToWordBoundaries(oldText, group.oldStart, group.oldEnd);
  const [newS, newE] = expandToWordBoundaries(newText, group.newStart, group.newEnd);

  const oldSpan = oldText.slice(oldS, oldE).trim();
  const newSpan = newText.slice(newS, newE).trim();

  if (hasDelete && hasInsert) {
    return `Change "${oldSpan}" to "${newSpan}"`;
  } else if (hasDelete) {
    // If deletion effectively changes a word into a different neighboring form, show change
    if (newSpan && oldSpan && oldSpan !== newSpan) {
      return `Change "${oldSpan}" to "${newSpan}"`;
    }
    return `Removed "${oldSpan}"`;
  } else if (hasInsert) {
    // If insertion effectively modifies a word (e.g., punctuation or letter), show change
    if (oldSpan && newSpan && oldSpan !== newSpan) {
      return `Change "${oldSpan}" to "${newSpan}"`;
    }
    return `Added "${newSpan}"`;
  }
  return 'No visible changes';
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
