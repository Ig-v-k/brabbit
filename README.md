![Logo!](/public/logo/logo64.png "brabbit")
# brabbit

[![Maintainability](https://api.codeclimate.com/v1/badges/b41e123463c5241a13ae/maintainability)](https://codeclimate.com/github/Ig-v-k/brabbit/maintainability)
[![Hits-of-Code](https://hitsofcode.com/github/Ig-v-k/brabbit?branch=master&label=Hits-of-Code)](https://hitsofcode.com/github/Ig-v-k/brabbit/view?branch=master&label=Hits-of-Code)

Statistics of words in Eminem songs: vocabulary size, richness, repetition, word length, parts of speech
and how all of it changed over his career. Every number comes with a one-line explanation.

## Run

No build, no dependencies. Open `index.html` in a browser, or serve the folder:

```sh
npx serve .        # or: python -m http.server
```

Pick an album in the selector to recalculate every metric for that album only.
Click a column header in the tracks table to sort.

## Metrics

| Metric | Formula | Reads as |
|---|---|---|
| Unique / Total | distinct words, all words | vocabulary size |
| Unique ratio (TTR) | unique / total | drops with text length, compare equal sizes only |
| MATTR | mean TTR of every 100-word window | length independent richness, comparable across tracks, albums, years |
| NWI | total / unique | "a new word every N words", lower is denser |
| Repeat interval | mean gap between two uses of the same word | low = hooks and repetition |
| Hapax legomena | words used once / unique | share of one-time words |
| Evolution | linear regression of per-track MATTR by year | pp per decade + Pearson r |
| Syllables | vowel groups, silent "e" handled | distribution + average |
| Characters | letters per word | distribution + average |
| POS | word lists, the rest is "other" | style profile |
| Lexical density | content words / total | information per line |
| Pronoun focus | first person / second person | introspection vs. addressing someone |

### Tokenization

`wordsOf()` in `public/js/utils.js`: lower case, curly quotes normalized, accents removed (`Déjà` → `deja`),
tokens with digits dropped (`2Pac`, `24/7`), stutters collapsed (`L-l-l-let` → `let`), hyphens split words,
inner apostrophes kept (`don't`, `it's` ≠ `its`), edge apostrophes removed (`'cause` → `cause`).

## Project structure

```
index.html            page and metric explanations (references)
public/data.js        lyrics: [{track, album, date: "dd.mm.yyyy", text}]
public/js/utils.js    pure statistic functions (no DOM, testable in Node)
public/js/main.js     rendering
public/css/main.css   styles (light / dark)
tests/                node:test unit tests for utils and data validation
```

## Adding a track

Append an object to `public/data.js`:

```js
{"track":"Title","album":"Album","date":"dd.mm.yyyy","text":`lyrics...`},
```

Then run the tests (Node 18+), they validate fields, dates, duplicates and hidden non-latin letters:

```sh
npm test
```
