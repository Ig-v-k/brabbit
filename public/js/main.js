const vrsn = '2.0';
const ALL = '';

document.addEventListener('DOMContentLoaded', onLoad);

function onLoad() {
    version();
    albumSelect(data);
    content(data);
}

const byId = (id) => document.getElementById(id);
const num = (value, digits = 0) => value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
});
const pct = (value, digits = 1) => `${num(value * 100, digits)}%`;
const setText = (id, text) => byId(id).textContent = text;
const ranked = (pairs, suffix = 'times') => pairs.map(([key, count]) => `"${key}": ${num(count)} ${suffix}`).join(', ');

/** Percentage distribution like `1: 79.4%, 2: 17.0%, ...` (only buckets with at least `min` share). */
function distribution(counts, min = 0.005) {
    const all = Object.values(counts).reduce((s, c) => s + c, 0);
    return Object.entries(counts)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .filter(([, count]) => count / all >= min)
        .map(([key, count]) => `${key}: ${pct(count / all)}`)
        .join(', ');
}

function albumSelect(songs) {
    const select = byId('album');
    const albums = [...new Set(arrayOf(songs, 'album'))]
        .map(album => ({album, year: Math.min(...songs.filter(s => s.album === album).map(s => yearOf(s.date)))}))
        .sort((a, b) => a.year - b.year);
    for (const {album, year} of albums) {
        const count = songs.filter(s => s.album === album).length;
        select.add(new Option(`${album} (${year}, ${count} ${count === 1 ? 'track' : 'tracks'})`, album));
    }
    select.addEventListener('change', () => {
        const value = select.value;
        content(value === ALL ? songs : songs.filter(s => s.album === value));
    });
}

function content(songs) {
    const words = textOf(arrayOf(songs, 'text'));

    const uniqueWords = () => setText('unique-val', `${num(unique(words))} words`);
    const totalWords = () => setText('total-val', `${num(total(words))} words`);
    const uniqueRatioWords = () => setText('uniqueRatio-val', pct(uniqueRatio(words), 2));
    const mattrWords = () => setText('mattr-val', pct(MATTR(words), 2));
    const NWIWords = () => setText('nwi-val', `a new word every ${num(NWI(words), 2)} words`);
    const repeatWords = () => setText('repeat-val', `a word returns after ${num(repeatInterval(words), 0)} words on average`);

    function hapaxWords() {
        const {count, share} = hapax(words);
        setText('hapax-val', `${num(count)} words (${pct(share)} of vocabulary) used only once`);
    }

    function evolutionWords() {
        const evol = evolution(songs);
        if (evol.trend === 'n/a') {
            const years = evol.periods.map(p => p.year).join(', ');
            setText('evolution-val', `n/a, selection covers a single year (${years})`);
            return;
        }
        const sign = evol.perDecade > 0 ? '+' : '';
        const periods = evol.periods.map(p => `${p.year}: ${pct(p.mattr)}`).join(' · ');
        setText('evolution-val',
            `${evol.trend} (${sign}${num(evol.perDecade * 100, 1)} pp of MATTR per decade, r = ${num(evol.r, 2)}). ${periods}`);
    }

    function syllableCountWords() {
        const counts = syllables(words);
        setText('syllables-val', `avg ${num(averageOf(counts), 2)} per word. ${distribution(counts)}`);
    }

    function characterCountWords() {
        const counts = characterCount(words);
        setText('character-val', `avg ${num(averageOf(counts), 2)} letters per word. ${distribution(counts, 0.01)}`);
    }

    function posWords() {
        const tags = pos(words);
        const posCounts = {};
        for (const {tag} of tags) {
            posCounts[tag] = (posCounts[tag] || 0) + 1;
        }
        const format = sortBy(Object.entries(posCounts), 'desc')
            .map(([tag, count]) => `${tag}: ${pct(count / tags.length)}`)
            .join(', ');
        setText('pos-val', format);
    }

    const lexicalWords = () => setText('lexical-val', `${pct(lexicalDensity(words))} content words`);

    function pronounWords() {
        const {i, you, ratio} = pronounFocus(words);
        const times = Number.isFinite(ratio) ? `${num(ratio, 2)}×` : '∞';
        setText('pronoun-val', `"I" ${num(i)} vs "you" ${num(you)}, ratio ${times}`);
    }

    const top3 = () => setText('top3-val', ranked(topWords(words, 3)));
    const top5Content = () => setText('top5content-val', ranked(topWords(words, 5, true)));

    function summary() {
        const stats = songs.map(trackStats).sort((a, b) => b.mattr - a.mattr);
        const richest = stats[0];
        const poorest = stats[stats.length - 1];
        const {share} = hapax(words);
        const {ratio} = pronounFocus(words);
        let text = `${songs.length} ${songs.length === 1 ? 'track' : 'tracks'}, ${num(total(words))} words. ` +
            `A new word appears every ${num(NWI(words), 1)} words and ${pct(share, 0)} of the vocabulary is used only once. `;
        if (Number.isFinite(ratio)) {
            text += `"I" is said ${num(ratio, 1)}× more often than "you". `;
        }
        if (stats.length > 1) {
            text += `Richest vocabulary: "${richest.track}" (MATTR ${pct(richest.mattr)}), ` +
                `most repetitive: "${poorest.track}" (${pct(poorest.mattr)}).`;
        }
        setText('summary', text);
    }

    const pWords = () => setText('text', words);

    function pTracks() {
        const t = byId('tracks');
        t.replaceChildren();
        const title = document.createElement('b');
        title.textContent = `Tracks (${songs.length}): `;
        t.append(title, arrayOf(songs, 'track').join(' • '));
    }

    uniqueWords();
    totalWords();
    uniqueRatioWords();
    mattrWords();
    NWIWords();
    repeatWords();
    hapaxWords();
    evolutionWords();
    syllableCountWords();
    characterCountWords();
    posWords();
    lexicalWords();
    pronounWords();
    top3();
    top5Content();
    summary();
    tracksTable(songs);
    pWords();
    pTracks();
}

const tableState = {key: 'mattr', desc: true};

function tracksTable(songs) {
    const columns = [
        ['track', 'Track', s => s.track],
        ['album', 'Album', s => s.album],
        ['year', 'Year', s => s.year],
        ['total', 'Words', s => num(s.total)],
        ['unique', 'Unique', s => num(s.unique)],
        ['ratio', 'Unique ratio', s => pct(s.ratio)],
        ['mattr', 'MATTR', s => pct(s.mattr)],
    ];
    const stats = songs.map(trackStats);
    const table = byId('tracks-table');

    function draw() {
        const {key, desc} = tableState;
        stats.sort((a, b) => {
            const cmp = typeof a[key] === 'string' ? a[key].localeCompare(b[key]) : a[key] - b[key];
            return desc ? -cmp : cmp;
        });
        const head = document.createElement('tr');
        for (const [colKey, label] of columns) {
            const th = document.createElement('th');
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = label + (colKey === key ? (desc ? ' ▼' : ' ▲') : '');
            button.addEventListener('click', () => {
                tableState.desc = tableState.key === colKey ? !tableState.desc : typeof stats[0][colKey] !== 'string';
                tableState.key = colKey;
                draw();
            });
            th.setAttribute('aria-sort', colKey === key ? (desc ? 'descending' : 'ascending') : 'none');
            th.append(button);
            head.append(th);
        }
        const rows = stats.map(s => {
            const tr = document.createElement('tr');
            for (const [, , value] of columns) {
                const td = document.createElement('td');
                td.textContent = value(s);
                tr.append(td);
            }
            return tr;
        });
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        thead.append(head);
        tbody.append(...rows);
        table.replaceChildren(thead, tbody);
    }

    draw();
}

function version() {
    setText('version', `v${vrsn}`);
}

function mixWords() {
    const text = byId('text');
    text.textContent = mix(text.textContent);
}

function openDialogBy(id) {
    byId(id).showModal();
}

/** Rhyme patterns per track (experimental, not displayed yet). */
function trackRhymes(tracks) {
    const stats = {};
    for (const line of arrayOf(tracks, 'text')) {
        const beats = rhymes(wordsOf(line));
        for (const group in beats) {
            if (beats[group].length > 1) {
                const pattern = group.repeat(beats[group].length);
                stats[pattern] = (stats[pattern] || 0) + 1;
            }
        }
    }
    return stats;
}
