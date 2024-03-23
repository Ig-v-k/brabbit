const NOT_WORD = /[^a-zA-Z\s]/g;

function counts(text) {
    const words = text.replace(NOT_WORD, "").split(" ").filter(word => word.trim());
    const counts = {};
    words.forEach(word => {
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
    const words = text.replace(NOT_WORD, "").split(" ").filter(word => word.trim());
    return words.length;
}

function unique(text) {
    text = text.toLowerCase().replace(NOT_WORD, "");
    const words = text.trim().split(/\s+/);
    const unique = new Set(words);
    return unique.size;
}

function uniqueRatio(text) {
    return unique(text) / total(text);
}