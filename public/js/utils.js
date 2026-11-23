// Pure statistic functions. No DOM access here, so everything can be tested in Node (see tests/).

const MATTR_WINDOW = 100;

const ARTICLES = ["a", "an", "the"];
const DETERMINERS = ["this", "that", "these", "those", "some", "any", "all", "every", "each", "no", "another", "such"];
const PREPOSITIONS = ["in", "on", "at", "to", "from", "by", "with", "as", "of", "for", "into", "onto", "out", "up",
    "down", "off", "over", "under", "about", "through", "after", "before", "like", "without", "around", "against",
    "between", "behind", "inside", "outside", "upon", "till", "til", "than", "via", "outta"];
const CONJUNCTIONS = ["and", "but", "or", "nor", "so", "yet", "if", "because", "cause", "cuz", "though", "although",
    "while", "when", "whether", "unless", "until", "since", "then"];
const FIRST_PERSON = ["i", "me", "my", "mine", "myself", "i'm", "i'll", "i've", "i'd", "i'ma", "ima"];
const SECOND_PERSON = ["you", "your", "yours", "yourself", "yourselves", "you're", "you'll", "you've", "you'd", "ya",
    "y'all", "yall"];
const PRONOUNS = [...FIRST_PERSON, ...SECOND_PERSON, "he", "him", "his", "himself", "he's", "she", "her", "hers",
    "herself", "she's", "it", "its", "it's", "itself", "we", "us", "our", "ours", "we're", "we'll", "they", "them",
    "their", "theirs", "they're", "they'll", "em", "who", "whom", "whose", "what", "which", "somebody", "someone",
    "something", "nobody", "nothing", "everybody", "everything", "anybody", "anything"];
const AUXILIARIES = ["be", "am", "is", "are", "was", "were", "been", "being", "have", "has", "had", "do", "does", "did",
    "will", "would", "shall", "should", "can", "could", "may", "might", "must", "ain't", "don't", "doesn't", "didn't",
    "won't", "wouldn't", "can't", "couldn't", "shouldn't", "isn't", "aren't", "wasn't", "weren't", "haven't",
    "hasn't", "gonna", "wanna", "gotta", "not"];
const VERBS = ["say", "get", "make", "go", "know", "take", "come", "see", "think", "look", "want", "like", "give",
    "use", "find", "tell", "work", "call", "move", "got", "said", "made", "went", "gone", "knew", "took", "came",
    "saw", "let", "put", "feel", "keep", "try", "need", "love", "hate", "kill", "die", "fuck", "show", "stop"];
const INTERJECTIONS = ["yeah", "yea", "oh", "uh", "ooh", "hey", "huh", "yo", "ha", "haha", "ah", "mm", "whoa", "okay",
    "ok", "hmm", "nah", "shh", "shht", "la"];

const FUNCTION_WORDS = new Set([...ARTICLES, ...DETERMINERS, ...PREPOSITIONS, ...CONJUNCTIONS, ...PRONOUNS,
    ...AUXILIARIES, ...INTERJECTIONS]);

/**
 * Splits lyrics into normalized words.
 * - lower case, curly quotes -> ', accents removed ("Déjà" -> "deja")
 * - tokens containing digits are dropped ("2Pac", "24/7", "'73")
 * - stutters are collapsed ("L-l-l-let" -> "let", "My-my-myself" -> "myself")
 * - hyphens and other punctuation split words ("space-bound" -> "space", "bound")
 * - apostrophes inside a word are kept ("don't", "it's"), on the edges removed ("'cause" -> "cause", "lookin'" -> "lookin")
 */
function wordsOf(text) {
    return text
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[‘’ʼ`]/g, "'")
        .replace(/\S*\d\S*/g, ' ')
        .replace(/\b([a-z]+)-(?=\1)/g, '')
        .replace(/[^a-z'\s]+/g, ' ')
        .replace(/(^|\s)'+/g, '$1')
        .replace(/'+(?=\s|$)/g, '')
        .split(/\s+/)
        .filter(word => word.length > 0);
}

function counts(text) {
    const result = {};
    for (const word of wordsOf(text)) {
        result[word] = (result[word] || 0) + 1;
    }
    return result;
}

function total(text) {
    return wordsOf(text).length;
}

function unique(text) {
    return new Set(wordsOf(text)).size;
}

/** Type-token ratio: unique / total, in range 0..1. Depends heavily on text length. */
function uniqueRatio(text) {
    const all = total(text);
    return all === 0 ? 0 : unique(text) / all;
}

/** New Word Interval: on average a new (not yet used) word appears every N words. total / unique. */
function NWI(text) {
    const uniques = unique(text);
    return uniques === 0 ? 0 : total(text) / uniques;
}

/** Average distance (in words) between two uses of the same word. */
function repeatInterval(text) {
    const last = {};
    let sum = 0;
    let repeats = 0;
    wordsOf(text).forEach((word, index) => {
        if (word in last) {
            sum += index - last[word];
            repeats++;
        }
        last[word] = index;
    });
    return repeats === 0 ? 0 : sum / repeats;
}

/**
 * Moving-Average Type-Token Ratio: mean unique ratio of every window of `size` consecutive words.
 * Unlike the plain ratio, it doesn't drop for longer texts, so tracks, albums and years can be compared.
 */
function MATTR(text, size = MATTR_WINDOW) {
    const words = Array.isArray(text) ? text : wordsOf(text);
    if (words.length === 0) {
        return 0;
    }
    if (words.length <= size) {
        return new Set(words).size / words.length;
    }
    const window = new Map();
    for (let i = 0; i < size; i++) {
        window.set(words[i], (window.get(words[i]) || 0) + 1);
    }
    let sum = window.size;
    for (let i = size; i < words.length; i++) {
        const out = words[i - size];
        const left = window.get(out) - 1;
        if (left === 0) {
            window.delete(out);
        } else {
            window.set(out, left);
        }
        window.set(words[i], (window.get(words[i]) || 0) + 1);
        sum += window.size;
    }
    const windows = words.length - size + 1;
    return sum / windows / size;
}

/** Hapax legomena: words used exactly once. */
function hapax(text) {
    const all = counts(text);
    const once = Object.values(all).filter(count => count === 1).length;
    const uniques = Object.keys(all).length;
    return {count: once, share: uniques === 0 ? 0 : once / uniques};
}

function syllablesOf(word) {
    let count = 0;
    let prev = false;
    for (const char of word) {
        const isVowel = "aeiouy".includes(char);
        if (isVowel && !prev) {
            count++;
        }
        prev = isVowel;
    }
    // silent "e": make, love, white (but: table, the)
    if (count > 1 && word.endsWith('e') && !word.endsWith('le') && !"aeiouy".includes(word[word.length - 2])) {
        count--;
    }
    return Math.max(count, 1);
}

/** Distribution of words by syllable count: {1: n, 2: n, ...} */
function syllables(text) {
    const result = {};
    for (const word of wordsOf(text)) {
        const count = syllablesOf(word);
        result[count] = (result[count] || 0) + 1;
    }
    return result;
}

/** Distribution of words by character count (apostrophes not counted): {1: n, 2: n, ...} */
function characterCount(text) {
    const result = {};
    for (const word of wordsOf(text)) {
        const count = word.replace(/'/g, '').length;
        result[count] = (result[count] || 0) + 1;
    }
    return result;
}

/** Weighted mean of a distribution object {value: count}. */
function averageOf(distribution) {
    let sum = 0;
    let n = 0;
    for (const [value, count] of Object.entries(distribution)) {
        sum += Number(value) * count;
        n += count;
    }
    return n === 0 ? 0 : sum / n;
}

/** Dictionary based part-of-speech tagging. Words not found in any list are tagged "other" (mostly nouns/adjectives). */
function pos(text) {
    const lists = [
        ["article", ARTICLES], ["determiner", DETERMINERS], ["pronoun", PRONOUNS], ["preposition", PREPOSITIONS],
        ["conjunction", CONJUNCTIONS], ["auxiliary", AUXILIARIES], ["verb", VERBS], ["interjection", INTERJECTIONS],
    ].map(([tag, list]) => [tag, new Set(list)]);
    return wordsOf(text).map(word => {
        const found = lists.find(([, set]) => set.has(word));
        return {word, tag: found ? found[0] : "other"};
    });
}

/** Share of content words (everything except function words and interjections). */
function lexicalDensity(text) {
    const words = wordsOf(text);
    if (words.length === 0) {
        return 0;
    }
    return words.filter(word => !FUNCTION_WORDS.has(word)).length / words.length;
}

/** "I" vs "you" focus: counts of first and second person words. */
function pronounFocus(text) {
    const first = new Set(FIRST_PERSON);
    const second = new Set(SECOND_PERSON);
    let i = 0;
    let you = 0;
    for (const word of wordsOf(text)) {
        if (first.has(word)) i++;
        else if (second.has(word)) you++;
    }
    return {i, you, ratio: you === 0 ? Infinity : i / you};
}

/** Most frequent words. With `contentOnly` function words are skipped. */
function topWords(text, n = 3, contentOnly = false) {
    return sortBy(Object.entries(counts(text)), 'desc')
        .filter(([word]) => !contentOnly || !FUNCTION_WORDS.has(word))
        .slice(0, n);
}

function sortBy(array, order) {
    if (order === 'ascending' || order === 'asc' || order === 0) {
        array.sort((a, b) => a[1] - b[1]);
    } else if (order === 'descending' || order === 'desc' || order === 1) {
        array.sort((a, b) => b[1] - a[1]);
    }
    return array;
}

/** Year from a "dd.mm.yyyy" date, or NaN. */
function yearOf(date) {
    const parts = String(date).split('.');
    return parts.length >= 3 ? parseInt(parts[2], 10) : NaN;
}

/** Least squares line y = slope * x + intercept, plus Pearson correlation r. */
function linearRegression(points) {
    const n = points.length;
    if (n < 2) {
        return {slope: 0, intercept: n ? points[0].y : 0, r: 0};
    }
    const mx = points.reduce((s, p) => s + p.x, 0) / n;
    const my = points.reduce((s, p) => s + p.y, 0) / n;
    let sxy = 0, sxx = 0, syy = 0;
    for (const {x, y} of points) {
        sxy += (x - mx) * (y - my);
        sxx += (x - mx) ** 2;
        syy += (y - my) ** 2;
    }
    const slope = sxx === 0 ? 0 : sxy / sxx;
    const r = sxx === 0 || syy === 0 ? 0 : sxy / Math.sqrt(sxx * syy);
    return {slope, intercept: my - slope * mx, r};
}

/** Vocabulary richness (MATTR) per release year, all songs of a year pooled together. */
function MATTRPeriods(songs) {
    const years = {};
    for (const song of songs) {
        const year = yearOf(song.date);
        (years[year] = years[year] || []).push(song.text);
    }
    return Object.entries(years)
        .map(([year, texts]) => ({year: Number(year), songs: texts.length, mattr: MATTR(texts.join(' '))}))
        .sort((a, b) => a.year - b.year);
}

/**
 * Evolution of vocabulary richness over time: linear trend of per-song MATTR by release year.
 * `perDecade` is the change of MATTR (0..1) per 10 years; trend is "increased" / "decreased" / "stable".
 */
function evolution(songs, threshold = 0.01) {
    const periods = MATTRPeriods(songs);
    if (periods.length < 2) {
        return {trend: "n/a", perDecade: 0, r: 0, periods};
    }
    const points = songs.map(song => ({x: yearOf(song.date), y: MATTR(song.text)}));
    const {slope, r} = linearRegression(points);
    const perDecade = slope * 10;
    let trend = "stable";
    if (perDecade >= threshold) trend = "increased";
    else if (perDecade <= -threshold) trend = "decreased";
    return {trend, perDecade, r, periods};
}

/** Per track statistics, used by the tracks table. */
function trackStats(song) {
    const words = wordsOf(song.text);
    const uniques = new Set(words).size;
    return {
        track: song.track,
        album: song.album || '',
        year: yearOf(song.date),
        total: words.length,
        unique: uniques,
        ratio: words.length ? uniques / words.length : 0,
        mattr: MATTR(words),
    };
}

function mix(text) {
    const array = wordsOf(text);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join(' ');
}

function rhymes(words, slice = -2) {
    const result = {};
    for (const raw of words) {
        const word = raw.toLowerCase().replace(/[^a-z]+$/, "");
        const sliced = word.slice(slice);
        (result[sliced] = result[sliced] || []).push(word);
    }
    return result;
}

const arrayOf = (obj, key) => obj.map(group => group[key]);

const array2dOf = (obj, first = 0, second = 1) => obj.map(group => [group[first], group[second]]);

const textOf = (array, separator = ' ') => array.join(separator);

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MATTR_WINDOW, FUNCTION_WORDS, wordsOf, counts, total, unique, uniqueRatio, NWI, repeatInterval, MATTR, hapax,
        syllablesOf, syllables, characterCount, averageOf, pos, lexicalDensity, pronounFocus, topWords, sortBy,
        yearOf, linearRegression, MATTRPeriods, evolution, trackStats, mix, rhymes, arrayOf, array2dOf, textOf,
    };
}
