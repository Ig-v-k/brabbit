function onLoad() {
    loaderFor(document.getElementById('container'));
    setTimeout(content, 2000);
}

function content() {
    const fTracks = () => {
        const bolds = tracks.map((el) => `<b>${el}</b>`);
        const joined = bolds.join(' • ');
        return `<p id="tracks">${joined}</p>`
    }

    const fWords = () => {
        return `<p id="words">${words}</p>`;
    }

    const fStatistic = (sentence) => {
        const popular = popularWord(sentence);
        return `<p id="statistic">${popular}</p>`;
    }

    const container = document.getElementById('container');
    container.innerHTML = fTracks() + fStatistic(words) + fWords();
}