const test = require('node:test');
const assert = require('node:assert/strict');
const u = require('../public/js/utils.js');

test('wordsOf normalizes lyrics', () => {
    assert.deepEqual(u.wordsOf("L-l-l-let My-my-myself It-it’s"), ['let', 'myself', "it's"]);
    assert.deepEqual(u.wordsOf("Déjà vu, space-bound"), ['deja', 'vu', 'space', 'bound']);
    assert.deepEqual(u.wordsOf("2Pac 24/7 '73 ok"), ['ok']);
    assert.deepEqual(u.wordsOf("'Cause I'm lookin' — clack"), ['cause', "i'm", 'lookin', 'clack']);
    assert.deepEqual(u.wordsOf("don't its it's"), ["don't", 'its', "it's"]);
    assert.deepEqual(u.wordsOf("   "), []);
});

test('counts, total, unique', () => {
    const text = 'I am, I am. You are';
    assert.deepEqual(u.counts(text), {i: 2, am: 2, you: 1, are: 1});
    assert.equal(u.total(text), 6);
    assert.equal(u.unique(text), 4);
});

test('uniqueRatio is a fraction 0..1', () => {
    assert.equal(u.uniqueRatio('a b a b'), 0.5);
    assert.equal(u.uniqueRatio(''), 0);
});

test('NWI is total / unique', () => {
    assert.equal(u.NWI('a b a b c c'), 2);
    assert.equal(u.NWI(''), 0);
});

test('repeatInterval averages gaps between repeats', () => {
    // a(0) b(1) a(2) b(3) -> gaps 2 and 2
    assert.equal(u.repeatInterval('a b a b'), 2);
    assert.equal(u.repeatInterval('a b c'), 0);
});

test('MATTR equals TTR for short text and is length independent', () => {
    assert.equal(u.MATTR('a b a b', 100), 0.5);
    assert.equal(u.MATTR('a b c a b c', 3), 1);
    assert.equal(u.MATTR('a a a a', 2), 0.5);
    const short = 'one two three four five six seven eight nine ten '.repeat(20);
    const long = short.repeat(10);
    assert.equal(u.MATTR(short, 10), u.MATTR(long, 10));
    assert.ok(u.uniqueRatio(long) < u.uniqueRatio(short));
});

test('hapax counts words used once', () => {
    assert.deepEqual(u.hapax('a a b c'), {count: 2, share: 2 / 3});
});

test('syllablesOf', () => {
    assert.equal(u.syllablesOf('the'), 1);
    assert.equal(u.syllablesOf('make'), 1);
    assert.equal(u.syllablesOf('table'), 2);
    assert.equal(u.syllablesOf('eminem'), 3);
    assert.equal(u.syllablesOf('discombobulated'), 6);
    assert.equal(u.syllablesOf('hmm'), 1);
});

test('characterCount ignores apostrophes', () => {
    assert.deepEqual(u.characterCount("don't go"), {2: 1, 4: 1});
});

test('averageOf distribution', () => {
    assert.equal(u.averageOf({1: 3, 3: 1}), 1.5);
    assert.equal(u.averageOf({}), 0);
});

test('pos tags with "other" fallback', () => {
    const tags = u.pos('the rabbit and I go').map(t => t.tag);
    assert.deepEqual(tags, ['article', 'other', 'conjunction', 'pronoun', 'verb']);
});

test('lexicalDensity and pronounFocus', () => {
    assert.equal(u.lexicalDensity('the rabbit and the hat'), 0.4);
    assert.deepEqual(u.pronounFocus("I'm me you"), {i: 2, you: 1, ratio: 2});
    assert.equal(u.pronounFocus('me').ratio, Infinity);
});

test('topWords', () => {
    assert.deepEqual(u.topWords('the cat the cat the dog', 2), [['the', 3], ['cat', 2]]);
    assert.deepEqual(u.topWords('the cat the cat the dog', 1, true), [['cat', 2]]);
});

test('yearOf', () => {
    assert.equal(u.yearOf('26.05.2002'), 2002);
    assert.ok(Number.isNaN(u.yearOf('2002')));
});

test('linearRegression', () => {
    const {slope, intercept, r} = u.linearRegression([{x: 0, y: 1}, {x: 1, y: 3}, {x: 2, y: 5}]);
    assert.equal(slope, 2);
    assert.equal(intercept, 1);
    assert.equal(r, 1);
});

test('evolution detects trend direction and single year', () => {
    const poor = 'a a a a a a a a';
    const rich = 'a b c d e f g h';
    const up = u.evolution([{date: '01.01.2000', text: poor}, {date: '01.01.2010', text: rich}]);
    assert.equal(up.trend, 'increased');
    const down = u.evolution([{date: '01.01.2000', text: rich}, {date: '01.01.2010', text: poor}]);
    assert.equal(down.trend, 'decreased');
    const flat = u.evolution([{date: '01.01.2000', text: rich}, {date: '01.01.2010', text: rich}]);
    assert.equal(flat.trend, 'stable');
    const one = u.evolution([{date: '01.01.2000', text: rich}, {date: '05.05.2000', text: poor}]);
    assert.equal(one.trend, 'n/a');
});

test('mix keeps the same words', () => {
    const text = 'one two three four five';
    assert.deepEqual(u.mix(text).split(' ').sort(), u.wordsOf(text).sort());
});
