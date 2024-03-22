function popularWord(sentence) {
    const words = sentence.split(" ");
    const map = {};
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const current = map[word];
        let count = current ? current : 0;
        map[word] = count + 1;
    }
    return map;
}