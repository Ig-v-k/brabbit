function onLoad() {
    loaderFor(document.getElementById('container'));
    setTimeout(content, 1500);
    lastModification();
}

function content() {
    const pTracks = (array) => {
        const joined = array.join(' • ');
        return `<p id="tracks"><b>Tracks:</b> ${joined}</p>`
    }

    const pWords = (text) => {
        return `<i id="words">${text}</i>`;
    }

    function top3Words(text) {
        const words = counts(text);
        const array = Object.entries(words);
        const sorted = sortBy(array, 'desc');
        const top3 = sorted.slice(0, 3);
        const rank = top3.map((wordCount, index) => {
            const [word, count] = wordCount;
            return ` ${index + 1}. "${word}": ${count} times`;
        });
        return `<span id="top3"><b>Top3 word:</b>${rank}</span>`
    }

    function totalWords(text) {
        const count = total(text);
        return `<span id="total"><b>Total:</b> ${count} words</span>`
    }

    function uniqueWords(text) {
        const count = unique(text);
        return `<span id="unique"><b>Unique:</b> ${count} words</span>`
    }

    function uniqueRatioWords(text) {
        let ratio = uniqueRatio(text);
        ratio = ratio.toFixed(2);
        return `<span id="unique"><b>Unique ratio:</b> ${ratio}%</span>`
    }

    const pStatistic = (sentence) => {
        const stats = [
            uniqueWords(sentence),
            totalWords(sentence),
            uniqueRatioWords(sentence),
            top3Words(sentence)
        ].join(' • ');
        return `<p id="statistic">${stats}</p>`;
    }

    const container = document.getElementById('container');
    container.innerHTML = pStatistic(words) + pWords(words) + pTracks(tracks);
}

function loaderFor(element) {
    element.innerText = '...';
}

function sortBy(array, order) {
    if (order === 'ascending' || order === 'asc' || order === 0) {
        array.sort((a, b) => a[1] - b[1]);
    } else if (order === 'descending' || order === 'desc' || order === 1) {
        array.sort((a, b) => b[1] - a[1]);
    }
    return array;
}

function lastModification() {
    const modification = document.getElementById('modification');
    const date = new Date(document.lastModified).toLocaleDateString();
    modification.innerText = `Last modified date ${date}`;
}