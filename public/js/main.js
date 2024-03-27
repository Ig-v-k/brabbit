const vrsn = 1.64;

function onLoad() {
    loaderFor(document.getElementById('container'));
    setTimeout(content, 1500);
//    lastModification();
    version();
}

function content() {
    const pTracks = (array) => {
        const joined = array.join('&ensp;•&ensp;');
        return `<p id="tracks"><b>Tracks (${array.length}):</b> ${joined}</p>`
    }

    const pWords = (text) => {
        return `<small><i id="text">${text}</i></small>`;
    }

    function top3Words(text) {
        const words = counts(text);
        const array = Object.entries(words);
        const sorted = sortBy(array, 'desc');
        const top3 = sorted.slice(0, 3);
        const rank = top3.map((wordCount, index) => {
            const [word, count] = wordCount;
            return ` "${word}": ${count} times`;
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
        return `<span id="uniqueRatio"><b>Unique ratio<sup><a href="#uniqueRatio-ref">[1]</a></sup>:</b> ${ratio}%</span>`
    }

    function NWIWords(text) {
        let nwi = NWI(text);
        nwi = nwi.toFixed(2);
        return `<span id="nwi"><b>NWI<sup><a href="#nwi-ref">[2]</a></sup>:</b> ${nwi} words</span>`
    }

    function syllableCountWords(text) {
        const counts = syllables(text);
        const array = Object.entries(counts);
        const format = array.map((pair, index) => {
            const [syllable, count] = pair;
            return ` "${syllable}": ${count} times`;
        });
        return `<span id="syllables"><b>Syllable<sup><a href="#syllable-ref">[3]</a></sup>:</b>${format}</span>`;
    }

    function characterCountWords(text) {
        const counts = characterCount(text);
        const array = Object.entries(counts);
        const sorted = sortBy(array, 'desc');
        const format = sorted.map((pair, index) => {
            const [character, count] = pair;
            return ` "${character}": ${count} times`;
        });
        return `<span id="character"><b>Charater<sup><a href="#character-ref">[4]</a></sup>:</b>${format}</span>`;
    }

    function top3PosWords(tags) {
        const minCount = 2;
        const posCounts = tags.reduce((acc, { tag }) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {});
        const filteredPosCounts = Object.entries(posCounts).filter(([tag, count]) => count >= minCount);
        filteredPosCounts.sort((a, b) => b[1] - a[1]);
        const top3PosTags = filteredPosCounts.slice(0, 3);
        const format = top3PosTags.map(([tag, count]) => {
            return ` "${tag}": ${count} times`;
        });
        return `<span id="pos"><b>POS<sup><a href="#pos-ref">[5]</a></sup>:</b>${format}</span>`;
    }

    const pStatistic = (sentence) => {
        const stats = [
            uniqueWords(sentence),
            totalWords(sentence),
            uniqueRatioWords(sentence),
            NWIWords(sentence),
            syllableCountWords(sentence),
            characterCountWords(sentence),
            top3PosWords(pos(sentence)),
            top3Words(sentence)
        ];
        const list = stats.map(stat => {
            return `<li>${stat}</li>`;
        });
        const joined = list.join('');
        return `<ul id="statistic">${joined}</ul>`;
    }

    const tracks = arrayOf(data, 'track');
    const words = textOf(arrayOf(data, 'text'));

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

function version() {
    const versionEl = document.getElementById('version');
    versionEl.innerText = `v${vrsn}`;
}