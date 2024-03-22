function popularWord(sentence) {
    const words = text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(" ");
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