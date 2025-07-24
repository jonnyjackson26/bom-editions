import csv
import json
import os
import sys
from collections import defaultdict
from difflib import ndiff

# Fix for Windows CSV field size limits
csv.field_size_limit(2**31 - 1)

# Editions to include
VERSIONS = ["1830", "1837", "1840", "1841", "1879", "1920", "1981", "2013"]

INPUT_DIR = "OpenScripture/book-of-mormon"
OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def clean_token(token):
    """Preserve spaces (⌴) as actual space tokens, skip ∅, strip newlines."""
    if token is None:
        return ""
    token = token.strip()
    if token == "∅":
        return ""
    if token == "⌴":  # Treat ⌴ as a space
        return " "
    return token

def build_tokens(row_texts):
    """
    Convert cleaned raw text tokens into token objects.
    Spaces become tokens with isWord=False.
    """
    tokens = []
    for tok in row_texts:
        if tok == "":
            continue
        is_word = not tok.isspace() and tok not in [",", ".", ";", ":", "?", "!", "—", "(", ")", "[", "]"]
        tokens.append({"text": tok, "isWord": is_word})
    return tokens

def load_chapter(file_path):
    """Load a chapter TSV into a dict of {verse: {version: [tokens...]}}."""
    verses = defaultdict(lambda: defaultdict(list))
    with open(file_path, newline='', encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for row in reader:
            citation = row["Citation"].strip()
            for version in VERSIONS:
                token = clean_token(row.get(version, ""))
                if token != "":
                    verses[citation][version].append(token)

    # Wrap into token objects for each verse/version
    for verse in verses:
        for version in VERSIONS:
            verses[verse][version] = build_tokens(verses[verse][version])
    return verses

def compute_token_diff(base_tokens, other_tokens):
    """
    Compute compact token-level diffs.
    Each diff is { index, remove: [tokens...], add: [tokens...] }.
    """
    base_texts = [t["text"] for t in base_tokens]
    other_texts = [t["text"] for t in other_tokens]

    diff_ops = []
    index = 0
    current = None

    for token in ndiff(base_texts, other_texts):
        code = token[0]
        text = token[2:]

        if code == " ":
            if current:
                diff_ops.append(current)
                current = None
            index += 1
        elif code == "-":
            if current is None:
                current = {"index": index, "remove": [], "add": []}
            tok = base_tokens[index]
            current["remove"].append(tok)
            index += 1
        elif code == "+":
            if current is None:
                current = {"index": index, "remove": [], "add": []}
            token_obj = {"text": text, "isWord": not text.isspace() and text not in [",", ".", ";", ":", "?", "!", "—", "(", ")", "[", "]"]}
            current["add"].append(token_obj)

    if current:
        diff_ops.append(current)

    return diff_ops

def save_chapter(book, chapter, verses):
    """Save base.json (1830 tokens) and edition diffs per chapter."""
    chapter_dir = os.path.join(OUTPUT_DIR, book, chapter)
    os.makedirs(chapter_dir, exist_ok=True)

    # Save base tokens
    base = {v: data["1830"] for v, data in verses.items()}
    with open(os.path.join(chapter_dir, "base.json"), "w", encoding="utf-8") as f:
        json.dump(base, f, indent=2, ensure_ascii=False)

    # Save diffs for each edition
    for version in VERSIONS:
        if version == "1830":
            continue
        diffs = {}
        for verse, data in verses.items():
            diff_ops = compute_token_diff(data["1830"], data[version])
            if diff_ops:
                diffs[verse] = diff_ops
        with open(os.path.join(chapter_dir, f"{version}.json"), "w", encoding="utf-8") as f:
            json.dump(diffs, f, indent=2, ensure_ascii=False)

def process_book(input_dir):
    for root, _, files in os.walk(input_dir):
        for file in files:
            if file.endswith(".tsv"):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, input_dir)
                parts = rel_path.replace("\\", "/").split("/")
                if len(parts) == 2:
                    book = parts[0]
                    chapter = parts[1].replace(".tsv", "")
                else:
                    book = "Unknown"
                    chapter = file.replace(".tsv", "")

                print(f"Processing {book} {chapter}...")
                verses = load_chapter(file_path)
                save_chapter(book, chapter, verses)
    print(f"Processing complete! Output saved in '{OUTPUT_DIR}/'")

if __name__ == "__main__":
    process_book(INPUT_DIR)
