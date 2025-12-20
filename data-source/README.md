Running process_scripture_data.py will read the OpenScripture tsv data and output clean JSON in public/data/en


https://github.com/BYU-ODH/OpenScripture has an error in the dataset.  

It should show

```
Mosiah 4:1	26.01	⌴	⌴	⌴	⌴	⌴	⌴	⌴	⌴
Mosiah 4:1	26.02	∅	∅	∅	∅	∅	∅	∅	∅
Mosiah 4:1	27	Angel	angel	angel	angel	angel	angel	angel	angel
```

but rather shows

```
Mosiah 4:1	26.01	⌴	⌴	⌴	⌴	⌴	⌴	⌴	⌴
Mosiah 4:1	26.02	∅	∅	∅	∅	"	∅	∅	∅
Mosiah 4:1	27	Angel	angel	angel	angel	angel	angel	angel	angel
```
I've submitted a PR on 12/20/25