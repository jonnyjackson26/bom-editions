import csv
import json
import os
import sys
from collections import defaultdict
from difflib import ndiff

# Fix for Windows CSV field size limits
csv.field_size_limit(2**31 - 1)

# Versions (columns in the dataset)
VERSIONS = ["1830", "1837", "1840", "1841", "1879", "1920", "1981", "2013"]

# Directories
INPUT_DIR = "OpenScripture/book-of-mormon"  # The folder you cloned from BYU-ODH
OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def clean_word(word):
    """Handle None, placeholders (⌴, ∅), and trim."""
    if word is None:
        return ""
    word = word.strip()
    if word in ("⌴", ""):
        return ""
    if word == "∅":
        return ""
    return word

def join_words(words):
    """Reassemble a verse from word tokens with proper spacing/punctuation."""
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
    """Parse a chapter TSV into {verse: {version: text}}."""
    verses = defaultdict(lambda: defaultdict(list))
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile, delimiter='\t')
        for row in reader:
            citation = row["Citation"].strip()  # e.g., "Enos 1:1"
            for version in VERSIONS:
                word = clean_word(row.get(version, ""))
                verses[citation][version].append(word)
    # Join tokens into complete verses
    for citation in verses:
        for version in VERSIONS:
            verses[citation][version] = join_words(verses[citation][version])
    return verses

def compute_diff(base_text, other_text):
    """Return a list of add/remove operations for diff rendering."""
    diff = []
    for token in ndiff(base_text.split(), other_text.split()):
        code = token[0]
        word = token[2:]
        if code == "-":
            diff.append({"remove": word})
        elif code == "+":
            diff.append({"add": word})
    return diff

def save_chapter_json(book, chapter, verses):
    """Save base.json and diff JSONs for a single chapter."""
    chapter_dir = os.path.join(OUTPUT_DIR, book, chapter)
    os.makedirs(chapter_dir, exist_ok=True)

    # Base JSON (1830 text)
    base = {v: data["1830"] for v, data in verses.items()}
    with open(os.path.join(chapter_dir, "base.json"), "w", encoding="utf-8") as f:
        json.dump(base, f, indent=2, ensure_ascii=False)

    # Diff JSONs
    for version in VERSIONS:
        if version == "1830":
            continue
        diffs = {}
        for verse, data in verses.items():
            diff_ops = compute_diff(data["1830"], data[version])
            if diff_ops:
                diffs[verse] = diff_ops
        with open(os.path.join(chapter_dir, f"{version}.json"), "w", encoding="utf-8") as f:
            json.dump(diffs, f, indent=2, ensure_ascii=False)

def process_book(input_dir):
    """Walk through all TSV files, process per chapter."""
    for root, _, files in os.walk(input_dir):
        for file in files:
            if file.endswith(".tsv"):
                file_path = os.path.join(root, file)

                # Determine book and chapter name from file path
                rel_path = os.path.relpath(file_path, input_dir)
                parts = rel_path.replace("\\", "/").split("/")  # handle Windows paths
                if len(parts) == 2:
                    book = parts[0]      # e.g., "Enos"
                    chapter = parts[1].replace(".tsv", "")  # e.g., "1"
                else:
                    # Default to root if structure is different
                    book = "Unknown"
                    chapter = file.replace(".tsv", "")

                print(f"Processing {book} {chapter}...")
                verses = load_chapter_tsv(file_path)
                save_chapter_json(book, chapter, verses)

    print(f"Processing complete! Output saved in '{OUTPUT_DIR}/'")

if __name__ == "__main__":
    process_book(INPUT_DIR)
