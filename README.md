# Book of Mormon Edition Project 
The goal of this project is to let people easily read older versions of the Book of Mormon, and to easily and meaningfully compare them. As well as view a list of changes between editions. 


## Routes

### General Pages
- `/`  
  Home page with links to each edition, explanations, and links to the changes pages. 

- `/about`  
  About the project

---

### Reading Routes
- `/en/<edition>`  
  Info on a specific edition (e.g. `1830`, `1920`, `1981`), with links to each book (1 Nephi, Alma, etc) in that edition. 
  - example `/en/1830` 

- `/en/<edition>/<book>`  
  Info on a specific book (e.g. `1-nephi`, `alma`, `moroni`), with links to each chapter in that book.
  - example `/en/1830/1-nephi` 

- `/en/<edition>/<book>/<chapter>`  
  Read a specific chapter from a specific edition  
  - Example: `/en/1830/1-nephi/1`

- `/en/<edition>/<book>/<chapter>?showFootnotes=true`  
  Read a specific chapter from a specific edition **with footnotes enabled**
 

- `/en/<edition>/<book>/<chapter>?compare=<editionX>`  
  Read a specific chapter from a specific edition **with inline strikethroughs for removed text from 'edition' to 'editionX'**

- `/en/simultaneous/<book>/<chapter>`  
  Read a specific chapter from all editions at once. 
  - Example: `/en/simultaneous/1-nephi/1`

---

### Change & Comparison Routes
- `/changes`  
  Info of basic textual changes between editions. Links to the "all changes" page and changes between each edition 

- `/changes/all`  
  All changes across **every edition**

- `/changes/<edition>`  
  Example: `/changes/1920` Changes from **1830 → 1920** 


## Technical details 
This project will use NextJS for good speed, SEO, and SSG.

### Data 
 - I'm storing full JSON for each edition. (I realize I could store the baseline 1830 edition and then store diffs for each newer edition, but I don't think it's worth the work at this time.)  
 - I want to eventually be able to have this work for different languages too, which is why I have an `en` folder, but for now I will only work on English. 
```
/public/data/
  en/
    1830/
      1-nephi/
        1.json
    1837/
      1-nephi/
        1.json
    1920/
      1-nephi/
        1.json
```

Example JSON file (/public/data/en/1830/1-nephi/1.json):
```
{
  "book": "1 Nephi",
  "chapter": 1,
  "edition": "1830",
  "verses": [
    { "verse": 1, "text": "I, Nephi, having been born of good parents..." },
    { "verse": 2, "text": "Yea, I make a record..." }
    ...
  ]
}
```

The data is from [Open Scripture](https://github.com/BYU-ODH/OpenScripture). I've included a git submodule and the processing steps in the `data-source` folder. This repository has the text data of all the editions in a tab seperated value file.  

### diff-match-patch
I'll be using diff-match-patch to calculate differences on the client side for pages like /changes and the reading routes with `?showFootnotes=true` and `?compare=<edition>`



# TODO:
- [ ] upgrade next js to fix seuciryt
- [ ] package lock has "name": "bom-editions2",
- [ ] metadata.ts: export const baseMetadata: Metadata = { metadataBase: new URL('https://bom-editions.com'),