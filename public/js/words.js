function counts(text) {
    const symbols = /[.,\/#!$%\^&\*;:{}=\-_`~()]/g;
    const words = text.replace(symbols, "").split(" ").filter(word => word.trim());
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
    const symbols = /[.,\/#!$%\^&\*;:{}=\-_`~()]/g;
    const words = text.replace(symbols, "").split(" ").filter(word => word.trim());
    return words.length;
}

function unique(text) {
    text = text.toLowerCase().replace(/[^a-zA-Z\s]/g, "");
    const words = text.trim().split(/\s+/);
    const unique = new Set(words);
    return unique.size;
}