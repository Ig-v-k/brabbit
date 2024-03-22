function counts(text) {
    const symbols = /[.,\/#!$%\^&\*;:{}=\-_`~()]/g;
    const words = text.replace(symbols, "").split(" ");
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