const test = require('node:test');
const assert = require('node:assert/strict');
const data = require('../public/data.js');

test('every track has track, album, date and text', () => {
    for (const song of data) {
        for (const key of ['track', 'album', 'date', 'text']) {
            assert.equal(typeof song[key], 'string', `${song.track}: ${key}`);
            assert.ok(song[key].trim().length > 0, `${song.track}: empty ${key}`);
        }
    }
});

test('dates are valid dd.mm.yyyy', () => {
    for (const {track, date} of data) {
        const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(date);
        assert.ok(match, `${track}: bad date format ${date}`);
        const [, d, m, y] = match.map(Number);
        const parsed = new Date(y, m - 1, d);
        assert.equal(parsed.getMonth(), m - 1, `${track}: impossible date ${date}`);
        assert.ok(y >= 1988 && y <= new Date().getFullYear(), `${track}: year out of range ${date}`);
    }
});

test('no duplicated tracks', () => {
    const names = data.map(s => s.track.toLowerCase());
    assert.deepEqual(names.filter((n, i) => names.indexOf(n) !== i), []);
});

test('no non-latin letters hidden in text (e.g. cyrillic "е")', () => {
    for (const {track, text} of data) {
        const bad = text.match(/[Ѐ-ӿ]/g);
        assert.equal(bad, null, `${track}: ${bad}`);
    }
});
