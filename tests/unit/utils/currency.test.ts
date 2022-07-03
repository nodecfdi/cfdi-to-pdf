import { formatCurrency, toCurrency } from '~/index';

describe('Currency', () => {
    test('number to currency letters', () => {
        expect(toCurrency(1500)).toBe('MIL QUINIENTOS PESOS 00/100 M.N.');
        expect(toCurrency(2000.5)).toBe('DOS MIL PESOS 50/100 M.N.');
    });

    test('format currency to only two decimals characters', () => {
        expect(formatCurrency(1500)).toBe('$1,500.00');
        expect(formatCurrency(2000.5)).toBe('$2,000.50');
    });
});
