import { toCurrency } from '../../../src';

describe('Currency', () => {
    test('number to currency letters', () => {
        expect(toCurrency(1500)).toBe('MIL QUINIENTOS PESOS 00/100 M.N.');
        expect(toCurrency(2000.5)).toBe('DOS MIL PESOS 50/100 M.N.');
    });
});
