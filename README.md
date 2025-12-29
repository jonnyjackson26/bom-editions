# Book of Mormon Edition Project 

The [**Book of Mormon Editions Project**](https://bom-editions.vercel.app) is an independent, nonpartisan digital resource dedicated to documenting and presenting the historical textual development of the Book of Mormon. Its purpose is to provide readers, researchers, and students with clear, direct access to multiple published editions, enabling careful study and transparent comparison over time.

All textual data used in this project is sourced from the  
[BYU Open Scripture Project](https://github.com/BYU-ODH/OpenScripture), whose meticulous work in digitizing historical editions of the Book of Mormon has made rigorous textual study possible. This project gratefully acknowledges their contribution and relies on their data as its authoritative textual foundation.

This project seeks to present historical textual data as accurately and transparently as possible, without interpretation or editorial bias. While absolute neutrality is impossible, I value openness and clarity. I therefore acknowledge that I am a member in good standing of The Church of Jesus Christ of Latter-day Saints and personally believe the Book of Mormon to be the word of God.

---

## Features

### Read Complete Editions
Read the complete text of each of the following edition with clean, consistent formatting:  
**1830, 1837, 1840, 1841, 1879, 1920, 1981, and 2013**  
[Browse editions →](https://bom-editions.vercel.app/en/editions)

### See Inline Differences
Compare editions with inline highlights showing additions, deletions, and modifications.  
[Try a comparison →](https://bom-editions.vercel.app/en/1830/1-nephi/1?compare=2013)

![Screenshot of 1830 with 2013 comparison](public/screenshots/1830-with-2013-comparison.png)

### Simultaneous View
View all editions at once to quickly compare changes.  
[Open simultaneous view →](https://bom-editions.vercel.app/en/simultaneous/1-nephi/1)

![Screenshot of simultaneous view](public/screenshots/simultaneous.png)

### Track All Changes
Browse a comprehensive, structured record of textual changes across editions.  
[View all changes →](https://bom-editions.vercel.app/changes/all)

![Screenshot of changes 1830 to 1837](public/screenshots/changes-1830-1837.png)


---

**Note on Verse Divisions and Introductory Material:**
The Book of Mormon was not divided into verses until the 1879 edition. For consistency and ease of reading, the text from earlier editions has been arranged into verses following the later structure. Additionally, certain content, such as introductory pages, has been omitted from this project to focus on the main scriptural text.


You can find more about me and this project on [My Website.](https://jonny-jackson.com/posts/book-of-mormon-editions-project/)



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
This project uses NextJS for good speed, SEO, and SSG.  
Uses @tanstack/react-virtual for fast loading of thousands of changes on the changes routes.
I'll be using **diff-match-patch** to calculate differences between editions

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




# TODO:
- Make it so if the church releases a new version of the bom, all you need to do is add a new folder of json in public/data.
- I've set up but haven't completed a lot of the `footnote` functionality. The idea of footnotes was that it would allow readers to see reversions in text. For example, some editions would make a change that brought back an original state of the text. See 1 Nephi 1:16 below:
```
1837: ... my father hath written, ...
1840: ... my father had written, ...
1841: ... my father hath written, ...
```
The reason I haven't finished is because the simultaneous edition page shows changes like this well, and I'm not sure anymore if footnotes in the reading routes are neccesary.

- on edge broswer when scrolling up at the top of the page on a chapter page the topbar scrolls down which looks bad.
- on mobile if the sidebar is open and its at the bottom and i scroll down on it, it closes the sidebar.
- there's too little space between the last character of the longest verse and the end of the code block in the simultaneous page.
- when i expand moroni on the sidebar, it should scroll down for me to see moronis chapters (its the last book.)
- custom dropdowns.




# Help Needed! Contributing to the Book of Mormon Editions Project

## Ways to Contribute

- **Bug fixes and UI improvements**  
  Help improve the website’s performance, accessibility, or user experience.

- **Adding new editions**  
  Contribute digitized editions of the Book of Mormon, in English or other languages.  

- **Data improvements**  
  We're missing introductory pages and other content that's not the main story of the Book of Mormon. If you have access to it, please add it.  

- **Documentation**  
  Help improve the site’s guides, explanations, or technical documentation.

---

## Data Contribution Guidelines

To maintain the scholarly and historical integrity of this project, all data contributions should adhere to the following:

1. **Source Requirements**  
   - Text must come from a verified edition of the Book of Mormon.  
   - Preferably from public domain sources or with explicit permission to share.  
   - Include full bibliographic or institutional attribution whenever possible.

2. **Formatting Requirements**  
   - Follow the existing JSON structure in the repository.   
   - Preserve original spelling, punctuation, and formatting.  
---

## Submitting Changes

1. **Fork** the repository.  
2. Create a **feature branch** for your changes.  
3. Make your improvements, following the formatting guidelines.  
4. Submit a **pull request (PR)** with a clear description of your changes.  
5. Include references or links to sources when contributing textual data.

---

### Reporting Issues

If you find a bug, formatting error, or missing data, please open an issue on GitHub.


### Supporting This Project

If you’d like to support this work, please reach out to me directly at [jonny-jackson.com](https://jonny-jackson.com).  

Financial support helps with domain/hosting costs, research, and further development of this project.
