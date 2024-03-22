function onLoad() {
    loaderFor(document.getElementById('container'));
    setTimeout(content, 1500);
}

function content() {
    const pTracks = (array) => {
        const bolds = array.map((el) => `<b>${el}</b>`);
        const joined = bolds.join(' • ');
        return `<p id="tracks">${joined}</p>`
    }

    const pWords = (text) => {
        return `<p id="words">${text}</p>`;
    }

    const pStatistic = (sentence) => {
        const popular = popularWord(sentence);
        return `<p id="statistic">${popular}</p>`;
    }

    const container = document.getElementById('container');
    container.innerHTML = pTracks(tracks) + pStatistic(words) + pWords(words);
}

function loaderFor(element) {
    element.innerText = '...';
}