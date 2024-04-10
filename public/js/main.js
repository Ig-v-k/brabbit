const vrsn = 1.81;

function onLoad() {
//    loaderFor(document.getElementById('container'));
    setTimeout(content, 1500);
//    lastModification();
    version();
}

function content() {
    const pTracks = (array) => {
        const joined = array.join('&ensp;•&ensp;');
        const t = document.getElementById('tracks');
        t.innerHTML = `<b>Tracks (${array.length}):</b> ${joined}`;
    }

    const pWords = (text) => {
        const t = document.getElementById('text');
        t.innerText = text;
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
        const t = document.getElementById('top3-val');
        t.innerHTML = `${rank}`;
    }

    function totalWords(text) {
        const count = total(text);
        const t = document.getElementById('total-val');
        t.innerHTML = `${count} words`;
    }

    function uniqueWords(text) {
        const count = unique(text);
        const t = document.getElementById('unique-val');
        t.innerHTML = `${count} words`;
    }

    function uniqueRatioWords(text) {
        let ratio = uniqueRatio(text);
        ratio = ratio.toFixed(2);
        const t = document.getElementById('uniqueRatio-val');
        t.innerHTML = `${ratio}%`;
    }

    function NWIWords(text) {
        let nwi = NWI(text);
        nwi = nwi.toFixed(2);
        const t = document.getElementById('nwi-val');
        t.innerHTML = `${nwi} words`;
    }

    function evolutionWords(songs) {
        const evol = evolution(songs);
        const t = document.getElementById('evolution-val');
        t.innerHTML = evol ? "decreased" : "consistent";
    }

    function syllableCountWords(text) {
        const counts = syllables(text);
        const array = Object.entries(counts);
        const format = array.map((pair, index) => {
            const [syllable, count] = pair;
            return ` "${syllable}": ${count} times`;
        });
        const t = document.getElementById('syllables-val');
        t.innerHTML = format;
    }

    function characterCountWords(text) {
        const counts = characterCount(text);
        const array = Object.entries(counts);
        const sorted = sortBy(array, 'desc');
        const format = sorted.map((pair, index) => {
            const [character, count] = pair;
            return ` "${character}": ${count} times`;
        });
        const t = document.getElementById('character-val');
        t.innerHTML = format;
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
        const t = document.getElementById('pos-val');
        t.innerHTML = format;
    }

    const pStatistic = (sentence) => {
        uniqueWords(sentence);
        totalWords(sentence);
        uniqueRatioWords(sentence);
        NWIWords(sentence);
        syllableCountWords(sentence);
        characterCountWords(sentence);
        top3PosWords(pos(sentence));
        top3Words(sentence);
    }

    const tracks = arrayOf(data, 'track');
    const words = textOf(arrayOf(data, 'text'));

    evolutionWords(data);

    pStatistic(words);
    pWords(words);
    pTracks(tracks);
}

function loaderFor(element) {
    element.innerText = '...';
}

function hide(element) {
    element.style.display = "none";
}

function show(element) {
    element.style.display = "block";
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

function mixWords() {
    const text = document.getElementById('text');
    const innerText = text.innerText;
    const mixed = mix(innerText);
    text.innerText = mixed;
}

function openDialogBy(id) {
    const dialog = document.getElementById(id);
    dialog.showModal();
}

function rhymeStats(tracks) {
    const stats = {};
    let lyrics = arrayOf(tracks, 'text');
    for (const line of lyrics) {
        const words = wordsOf(line);
        const beats = rhymes(words);
        for (const group in beats) {
            if (beats[group].length > 1) {
                const pattern = `${group.repeat(beats[group].length)}`;
                if (!stats[pattern]) {
                    stats[pattern] = 0;
                }
                stats[pattern]++;
            }
        }
    }
    return stats;
}