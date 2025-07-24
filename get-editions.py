import csv
import json
import os
from collections import defaultdict
from difflib import ndiff

# Versions to handle (columns in CSV)
VERSIONS = ["1830", "1837", "1840", "1841", "1879", "1920", "1981", "2013"]

# Output directory
OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def clean_word(word):
    """Remove placeholders like ⌴ and handle ∅ (deletions)."""
    if word == "⌴":  # Placeholder for space, skip
        return ""
    if word == "∅":  # Represents deletion
        return ""
    return word

def join_words(words):
    """Join words into a readable verse string (handling spaces/punctuation)."""
    text = ""
    for w in words:
        if not w:
            continue
        # Avoid adding a space before punctuation
        if w in [",", ".", ";", ":", "?", "!", "—"]:
            text = text.rstrip() + w + " "
        else:
            text += w + " "
    return text.strip()

def load_csv(file_path):
    """Parse a CSV file into a dict of verses with all versions."""
    verses = defaultdict(lambda: defaultdict(list))  # {verse: {version: [words...]}}
    
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile, delimiter='\t')
        for row in reader:
            citation = row["Citation"].strip()
            for version in VERSIONS:
                word = clean_word(row[version].strip())
                verses[citation][version].append(word)
    # Join words into full verses
    for citation in verses:
        for version in VERSIONS:
            verses[citation][version] = join_words(verses[citation][version])
    return verses

def compute_diff(base_text, other_text):
    """Compute a diff as a list of operations (for strikethrough/bold rendering)."""
    diff = []
    for token in ndiff(base_text.split(), other_text.split()):
        code = token[0]
        word = token[2:]
        if code == "-":  # Removed from base
            diff.append({"remove": word})
        elif code == "+":  # Added in other version
            diff.append({"add": word})
    return diff

def process_dataset(csv_path):
    verses = load_csv(csv_path)
    
    # Build base JSON (1830 text)
    base = {verse: data["1830"] for verse, data in verses.items()}
    with open(os.path.join(OUTPUT_DIR, "base.json"), "w", encoding="utf-8") as f:
        json.dump(base, f, indent=2, ensure_ascii=False)

    # Build diffs for each other version
    for version in VERSIONS:
        if version == "1830":
            continue
        diffs = {}
        for verse, data in verses.items():
            base_text = data["1830"]
            other_text = data[version]
            diff_ops = compute_diff(base_text, other_text)
            if diff_ops:
                diffs[verse] = diff_ops
        # Save version diff
        with open(os.path.join(OUTPUT_DIR, f"{version}.json"), "w", encoding="utf-8") as f:
            json.dump(diffs, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    csv_path = "OpenScripture/book-of-mormon/Enos.tsv"
    process_dataset(csv_path)
    print("Processing complete! Files saved in 'output/'")
