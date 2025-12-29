# Book of Mormon Edition Project 
The goal of this project is to let people easily read older versions of the Book of Mormon, and to easily and meaningfully compare them. As well as view a list of changes between editions. 

Learn more about this project on [my website.](https://jonny-jackson.com/posts/book-of-mormon-editions-project/)

This project does it's best to be unbiased, showing only concrete facts and avoiding opinions as much as possible. While I myself am a member of the Church of Jesus Christ of Latter-Day Saints in good standing and a beliver that the Book of Mormon is the word of God. For example, I avoid phrases like
 "There have been thousands of changes to the text of the Book of Mormon over the years, most of them corrections of typographical errors and standardization of spelling and punctuation."
and also even phrases like
 "There have been thousands of changes to the text of the Book of Mormon over the years."
And instead opt for buttons to see *X* amount of changes from *Edition A* to *Edition B*.

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
Uses @tanstack/react-virtual for fast loading of thousands of changes

## Development
To run locally:
```bash
npm i
npm run dev
```
Alternatively, this code is deployed on Vercel at https://bom-editions.vercel.app/

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



ok, a clarification for the footnotes. it should be a little number (resets each verse) that shows after a word in which that word has been changed between editions. When you hover over the footnote (or click it on mobile), it shows a dropdown of how that word and the word before/after it have changed over time.

for example, consider 1 nephi 1:2:
1830: yea, I make a record in the language of my father, which consists of the learning of the Jews and the language of the Egyptians.
1837: yea, I make a record in the language of my father, which consists of the learning of the Jews and the language of the Egyptians.
1840: yea, I make a record in the language of my father, which consists of the learning of the Jews and the language of the Egyptians.
1841: yea, I make a record in the language of my father, which consists of the learning of the Jews and the language of the Egyptians.
1879: Yea, I make a record in the language of my father, which consists of the learning of the Jews, and the language of the Egyptians.
1920: Yea, I make a record in the language of my father, which consists of the learning of the Jews and the language of the Egyptians.
1981: Yea, I make a record in the language of my father, which consists of the learning of the Jews and the language of the Egyptians.
2013: Yea, I make a record in the language of my father, which consists of the learning of the Jews and the language of the Egyptians.

If i have footnotes enabled and im reading this verse (no matter which edition im reading or whether or not im comparing), there should be a little "1" footnote after the word "yea,". and hovering it would show:
1830: yea,
1837: yea,
1840: yea,
1841: yea,
1879: Yea,
1920: Yea,
2013: Yea,



on edge when scrolling up at the top of the page on a chapter page the topbar scrolls down which looks bad.

on mobile if the sidebar is open and its at the bottom and i scroll down on it, it closes the sidebar.

there's too little space between the last character of the longest verse and the end of the <pre> block in the simultaneous page.

4 vulnerabilities (3 high, 1 critical)

todo:
- vercel analytics
- when i expand moroni on the sidebar, it should scroll down for me to see moronis chapters (its the last book.)
- custom dropdowns.

