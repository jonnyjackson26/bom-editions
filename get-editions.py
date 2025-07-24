import csv
import json
import os
import sys
from collections import defaultdict
from difflib import ndiff

# Fix for Windows CSV field size limits
csv.field_size_limit(2**31 - 1)

# Versions to process (columns in the dataset)
VERSIONS = ["1830", "1837", "1840", "1841", "1879", "1920", "1981", "2013"]

# Directories
INPUT_DIR = "OpenScripture/book-of-mormon"  # Path to BYU-ODH repo data
OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def clean_word(word):
    """Handle None, placeholders (⌴, ∅), and trim."""
    if word is None:
        return ""
    word = word.strip()
    if word in ("⌴", "", "∅"):
        return ""
    return word

def join_words(words):
    """Reassemble tokens into a verse string with proper spacing/punctuation."""
    text = ""
    for w in words:
        if not w:
            continue
        if w in [",", ".", ";", ":", "?", "!", "—"]:
            text = text.rstrip() + w + " "
        else:
            text += w + " "
    return text.strip()

def load_chapter_tsv(file_path):
    """Parse a TSV into {verse: {version: full_text}} for each chapter."""
    verses = defaultdict(lambda: defaultdict(list))
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile, delimiter='\t')
        for row in reader:
            citation = row["Citation"].strip()  # e.g., "Enos 1:1"
            for version in VERSIONS:
                word = clean_word(row.get(version, ""))
                verses[citation][version].append(word)
    # Join tokens into full strings
    for citation in verses:
        for version in VERSIONS:
            verses[citation][version] = join_words(verses[citation][version])
    return verses

def compute_compact_diff(base_text, other_text):
    """
    Return a compact diff as a list of objects:
      - index: word position in the base (0-based)
      - remove: list of removed words (if any)
      - add: list of added words (if any)
    Groups consecutive changes.
    """
    base_words = base_text.split()
    other_words = other_text.split()
    diff_ops = []
    index = 0
    current = None

    for token in ndiff(base_words, other_words):
        code = token[0]
        word = token[2:]

        if code == " ":
            # Flush current diff if we hit unchanged words
            if current:
                diff_ops.append(current)
                current = None
            index += 1
        elif code == "-":  # removed from base
            if current is None:
                current = {"index": index, "remove": [], "add": []}
            current["remove"].append(word)
            index += 1
        elif code == "+":  # added in other
            if current is None:
                current = {"index": index, "remove": [], "add": []}
            current["add"].append(word)

    # Flush any pending diff
    if current:
        diff_ops.append(current)

    return diff_ops

def save_chapter_json(book, chapter, verses):
    """
    For each chapter:
      - Save base.json (1830 edition)
      - Save compact diffs for each later version
    """
    chapter_dir = os.path.join(OUTPUT_DIR, book, chapter)
    os.makedirs(chapter_dir, exist_ok=True)

    # Save the 1830 text as the base
    base = {v: data["1830"] for v, data in verses.items()}
    with open(os.path.join(chapter_dir, "base.json"), "w", encoding="utf-8") as f:
        json.dump(base, f, indent=2, ensure_ascii=False)

    # Save diffs for each other version
    for version in VERSIONS:
        if version == "1830":
            continue
        diffs = {}
        for verse, data in verses.items():
            diff_ops = compute_compact_diff(data["1830"], data[version])
            if diff_ops:  # Only save verses with differences
                diffs[verse] = diff_ops
        with open(os.path.join(chapter_dir, f"{version}.json"), "w", encoding="utf-8") as f:
            json.dump(diffs, f, indent=2, ensure_ascii=False)

def process_book(input_dir):
    """Walk all TSV files in the repo and process per-chapter JSON outputs."""
    for root, _, files in os.walk(input_dir):
        for file in files:
            if file.endswith(".tsv"):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, input_dir)
                parts = rel_path.replace("\\", "/").split("/")
                if len(parts) == 2:
                    book = parts[0]  # e.g., "Enos"
                    chapter = parts[1].replace(".tsv", "")  # e.g., "1"
                else:
                    book = "Unknown"
                    chapter = file.replace(".tsv", "")

                print(f"Processing {book} {chapter}...")
                verses = load_chapter_tsv(file_path)
                save_chapter_json(book, chapter, verses)

    print(f"Processing complete! Output saved in '{OUTPUT_DIR}/'")

if __name__ == "__main__":
    process_book(INPUT_DIR)
