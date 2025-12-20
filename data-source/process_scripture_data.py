#!/usr/bin/env python3
"""
Script to process OpenScripture data and generate JSON files in the format:
{
  "book": "1 Nephi",
  "chapter": 1,
  "edition": "1830",
  "verses": [
    { "verse": 1, "text": "..." },
    ...
  ]
}

OpenScripture Data Structure:
- Each line represents a word, punctuation mark, or space
- Column 1: Citation (e.g., "1 Nephi 1:1")
- Column 2: Word ID (integer = head word, decimal = subword/punctuation/space)
- Column 3+: Edition data (1830, 1837, 1840, 1841, 1879, 1920, 1981, 2013)
- ∅ = null (text doesn't exist in that edition)
- ⌴ = space character
"""

import json
import re
from pathlib import Path
from collections import defaultdict

# Configuration
OPENSCRIPTURE_DIR = Path(__file__).parent / "OpenScripture" / "book-of-mormon"
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "data" / "en"  # Easily changeable
EDITIONS = ["1830", "1837", "1840", "1841", "1879", "1920", "1981", "2013"]


def parse_citation(citation):
    """Parse citation like '1 Nephi 1:1' to (book, chapter, verse)"""
    match = re.match(r"(.+?)\s+(\d+):(\d+)", citation)
    if match:
        book, chapter, verse = match.groups()
        return book, int(chapter), int(verse)
    return None, None, None


def get_book_slug(book_name):
    """Convert book name to slug format (e.g., '1 Nephi' -> '1-nephi')"""
    return book_name.lower().replace(" ", "-")


def process_tsv_file(filepath):
    """
    Process a single TSV file and return data organized by edition, chapter, and verse.
    
    The OpenScripture data uses:
    - Integer word IDs (1, 2, 3...) for head words
    - Decimal word IDs (1.01, 1.02...) for punctuation/spaces following the head word
    - ∅ for null (text doesn't exist in that edition)
    - ⌴ for space characters
    
    Returns: {edition: {chapter: {verse: text}}}, book_name
    """
    data = defaultdict(lambda: defaultdict(lambda: defaultdict(str)))
    book_name = None

    with open(filepath, "r", encoding="utf-8") as f:
        # Read header to find edition columns
        header = f.readline().strip().split("\t")
        
        # Map edition names to column indices
        edition_cols = {}
        for edition in EDITIONS:
            if edition in header:
                edition_cols[edition] = header.index(edition)

        # Process each line (word/punctuation/space)
        for line in f:
            parts = line.strip().split("\t")
            if len(parts) < 3:
                continue

            citation = parts[0]
            word_id = parts[1]

            # Parse citation to get book, chapter, verse
            book, chapter, verse = parse_citation(citation)
            if book is None:
                continue

            book_name = book

            # Process each edition's text for this word/punctuation/space
            for edition in EDITIONS:
                if edition not in edition_cols:
                    continue
                    
                col_idx = edition_cols[edition]
                if col_idx >= len(parts):
                    continue
                    
                text = parts[col_idx]
                
                # Skip null characters (text doesn't exist in this edition)
                if text == "∅":
                    continue
                
                # Convert space symbol to actual space
                if text == "⌴":
                    text = " "
                
                # Append to verse
                data[edition][chapter][verse] += text

    return dict(data), book_name


def clean_verse_text(text):
    """
    Clean up verse text:
    - Normalize multiple spaces to single space
    - Remove leading/trailing whitespace
    - Fix spacing around punctuation if needed
    """
    # Replace multiple spaces with single space
    text = re.sub(r" +", " ", text)
    # Remove leading/trailing spaces
    text = text.strip()
    return text


def create_json_files():
    """Main function to process all TSV files and create JSON output"""
    tsv_files = sorted(OPENSCRIPTURE_DIR.glob("*.tsv"))
    
    if not tsv_files:
        print(f"Error: No TSV files found in {OPENSCRIPTURE_DIR}")
        return

    print(f"Found {len(tsv_files)} TSV files\n")
    
    for tsv_file in tsv_files:
        print(f"Processing: {tsv_file.name}")
        
        data, book_name = process_tsv_file(tsv_file)
        
        if not data:
            print(f"  No data extracted")
            continue

        book_slug = get_book_slug(book_name)

        # Process each edition
        for edition in EDITIONS:
            if edition not in data:
                continue

            edition_data = data[edition]
            
            # Process each chapter
            for chapter in sorted(edition_data.keys()):
                verses_dict = edition_data[chapter]
                
                # Build verses array
                verses = []
                for verse_num in sorted(verses_dict.keys()):
                    verse_text = clean_verse_text(verses_dict[verse_num])
                    if verse_text:  # Only include non-empty verses
                        verses.append({
                            "verse": verse_num,
                            "text": verse_text
                        })
                
                if not verses:
                    continue
                
                # Create output directory
                output_path = OUTPUT_DIR / edition / book_slug
                output_path.mkdir(parents=True, exist_ok=True)
                
                # Create JSON object
                json_data = {
                    "book": book_name,
                    "chapter": chapter,
                    "edition": edition,
                    "verses": verses
                }
                
                # Write JSON file
                json_file = output_path / f"{chapter}.json"
                with open(json_file, "w", encoding="utf-8") as f:
                    json.dump(json_data, f, indent=2, ensure_ascii=False)
                
                print(f"  Created: {json_file.relative_to(OUTPUT_DIR.parent)}")


if __name__ == "__main__":
    print(f"Output directory: {OUTPUT_DIR}")
    print(f"OpenScripture data: {OPENSCRIPTURE_DIR}\n")
    create_json_files()
    print("\nDone!")
