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

function words(text) {
    return text.toLowerCase().replace(NOT_WORD, "").trim().split(/\s+/).filter(word => word.trim());
}