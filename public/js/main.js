function onLoad() {
    loaderFor(document.getElementById('container'));
    setTimeout(content, 1500);
}

function content() {
    const fTracks = (array) => {
        const bolds = array.map((el) => `<b>${el}</b>`);
        const joined = bolds.join(' • ');
        return `<p id="tracks">${joined}</p>`
    }

    const fWords = (text) => {
        return `<p id="words">${text}</p>`;
    }

    const fStatistic = (sentence) => {
        const popular = popularWord(sentence);
        return `<p id="statistic">${popular}</p>`;
    }

    const container = document.getElementById('container');
    container.innerHTML = fTracks(tracks) + fStatistic(words) + fWords(words);
}