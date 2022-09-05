import _mock from './_mock';
import { randomNumberRange } from './funcs';

// ----------------------------------------------------------------------

export const _powerList = [...Array(15)].map((_, index) => ({
    id: _mock.idNumber(index),
    twentyHours: _mock.name.gg(index),
    burt: randomNumberRange(0, 30),
    addPower: randomNumberRange(0, 30),
    reason: randomNumberRange(0, 30),
    postReady: randomNumberRange(0, 30),
    postAttendet :randomNumberRange(0, 30)
}));