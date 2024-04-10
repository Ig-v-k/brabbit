const NOT_WORD = /[^a-zA-Z\s]/g;

function counts(text) {
    const filtered = wordsOf(text);
    const counts = {};
    filtered.forEach(word => {
        word = word.trim();
        if (counts[word]) {
            counts[word]++;
        } else {
            counts[word] = 1;
        }
    })
    return counts;
}

function total(text) {
    const filtered = wordsOf(text);
    return filtered.length;
}

function unique(text) {
    const array = wordsOf(text);
    const unique = new Set(array);
    return unique.size;
}

function uniqueRatio(text) {
    return unique(text) / total(text);
}

function NWI(text) {
    const words = wordsOf(text);
    const indices = {};
    const counts = {};
    let interval = 0;
    let uniques = 0;
    words.forEach((word, index) => {
        if (!(word in indices)) {
            indices[word] = index;
            counts[word] = 1;
            uniques++;
        } else {
            interval += index - indices[word];
            indices[word] = index;
            counts[word]++;
        }
    });
    let nwi = 0;
    Object.values(counts).forEach(count => {
        nwi += count - 1;
    });
    const average = interval / nwi;
    return average;
}

function NWIPeriods(songs) {
    const nwiPeriods = [];
    for (const song of songs) {
        const nwi = NWI(song.text);
        const year = yearOf(song.date);
        nwiPeriods.push({ year: year, nwi });
    }
    return nwiPeriods;
}

function evolution(songs) {
    const periods = NWIPeriods(songs);
    periods.sort((a, b) => a.year - b.year);
    let decreased = false;
    let prev = Infinity;
    for (const period of periods) {
        if (period.nwi < prev) {
            decreased = true;
        }
        prev = period.nwi;
    }
    return decreased;
}

function syllables(text) {
    const array = wordsOf(text);
    function vowel(word) {
        let count = 0;
        let prev = false;
        for (let char of word) {
            const isVowel = "aeiouy".includes(char);
            if (isVowel && !prev) {
                count++;
            }
            prev = isVowel;
        }
        return count === 0 ? 1 : count;
    }
    const counts = {};
    for (const word of array) {
        const count = vowel(word);
        counts[count] = (counts[count] || 0) + 1;
    }
    return counts;
}

function characterCount(text) {
    const array = wordsOf(text);
    const counts = {};
    for (const word of array) {
        const count = word.length;
        counts[count] = (counts[count] || 0) + 1;
    }
    return counts;
}

function wordsOf(text) {
    return text.toLowerCase().replace(NOT_WORD, "").trim().split(/\s+/).filter(word => word.trim());
}

const arrayOf = (obj, key) => {
    return obj.map(group => group[key]);
}

const array2dOf = (obj, first = 0, second = 1) => {
    return obj.map(group => [group[first], group[second]]);
}

const textOf = (array, separator = ' ') => {
    return array.join(separator);
}

function pos(text) {
    const array = wordsOf(text);
    const articles = ["a", "an", "the"];
    const prepositions = ["in", "on", "at", "to", "from", "by", "with", "as"];
    const conjunctions = ["and", "but", "or", "nor", "for", "so", "yet"];
    const pronouns = ["i", "me", "my", "mine", "you", "your", "yours", "he", "him", "his", "she", "her", "hers", "it", "its", "we", "us", "our", "ours", "they", "them", "their", "theirs", "who", "what", "which", "that"];
    const verbs = ["be", "have", "do", "say", "get", "make", "go", "know", "take", "come", "see", "can", "will", "think", "look", "want", "like", "give", "use", "find", "tell", "work", "call", "move", "other"];
    const tags = [];
    for (const word of array) {
        if (articles.includes(word)) {
            tags.push({ word, tag: "article" });
        } else if (prepositions.includes(word)) {
            tags.push({ word, tag: "preposition" });
        } else if (conjunctions.includes(word)) {
            tags.push({ word, tag: "conjunction" });
        } else if (pronouns.includes(word)) {
            tags.push({ word, tag: "pronoun" });
        } else if (verbs.includes(word)) {
            tags.push({ word, tag: "verb" });
        } else {
            tags.push({ word, tag: "noun" });
        }
    }
    return tags;
}

function mix(text) {
    const array = wordsOf(text);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join(' ');
}

function yearOf(date) {
    const parts = date.split('.');
    if (parts.length >= 3) {
        return parseInt(parts[2], 10);
    } else {
        return '';
    }
}

function rhymes(words, slice = -2) {
    const rhymes = {};
    for (let i = 0; i < words.length; i++) {
        const word = words[i].toLowerCase().replace(/[^a-z]+$/, "");
        const sliced = word.slice(slice);
        if (!rhymes[sliced]) {
            rhymes[sliced] = [];
        }
        rhymes[sliced].push(word);
    }
    return rhymes;
}