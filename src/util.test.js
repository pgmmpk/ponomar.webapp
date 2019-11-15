import test from 'ava';
import { dateMMDDYYYY } from './util.js';

test('dateMMDDYYY', t => {
    const date = dateMMDDYYYY({year: 2019, month: 3, day: 1});

    t.is(date, '03/01/2019');
});