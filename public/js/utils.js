const NOT_WORD = /[^a-zA-Z\s]/g;

function counts(text) {
    const filtered = words(text);
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
    const filtered = words(text);
    return filtered.length;
}

function unique(text) {
    const array = words(text);
    const unique = new Set(array);
    return unique.size;
}

function uniqueRatio(text) {
    return unique(text) / total(text);
}

function NWI(text) {
    const array = words(text);
    const uniques = new Set();
    let interval = 0;
    let total = 0;
    for (let i = 0; i < array.length; i++) {
        const word = array[i];
        if (!uniques.has(word)) {
            uniques.add(word);
            total++;
            if (total > 1) {
                interval += i;
            }
        }
    }
    const NWI = total > 1 ? interval / (total - 1) : 0;
    return NWI;
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
    const array = words(text);
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
    const array = words(text);
    const counts = {};
    for (const word of array) {
        const count = word.length;
        counts[count] = (counts[count] || 0) + 1;
    }
    return counts;
}

function words(text) {
    return text.toLowerCase().replace(NOT_WORD, "").trim().split(/\s+/).filter(word => word.trim());
}

const arrayOf = (obj, key) => {
    return obj.map(triplet => triplet[key]);
}

const textOf = (array, separator = ' ') => {
    return array.join(separator);
}

function pos(text) {
    const array = words(text);
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
    const array = words(text);
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