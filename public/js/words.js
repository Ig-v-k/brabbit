const NOT_WORD = /[^a-zA-Z\s]/g;

function counts(text) {
    const filtered = words(text).filter(word => word.trim());
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
    const filtered = words(text).filter(word => word.trim());
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

function words(text) {
    return text.toLowerCase().replace(NOT_WORD, "").trim().split(/\s+/);
}