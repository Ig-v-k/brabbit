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