import { formatCurrency, toCurrency } from '~/index';

describe('Currency', () => {
    test.each([
        [0, 'CERO PESOS 00/100 M.N.'],
        [1, 'UN PESO 00/100 M.N.'],
        [2, 'DOS PESOS 00/100 M.N.'],
        [3, 'TRES PESOS 00/100 M.N.'],
        [10, 'DIEZ PESOS 00/100 M.N.'],
        [11, 'ONCE PESOS 00/100 M.N.'],
        [12, 'DOCE PESOS 00/100 M.N.'],
        [13, 'TRECE PESOS 00/100 M.N.'],
        [14, 'CATORCE PESOS 00/100 M.N.'],
        [15, 'QUINCE PESOS 00/100 M.N.']
    ])('number basics to currency letters', (input: number, expected: string) => {
        expect(toCurrency(input)).toBe(expected);
    });

    test.each([
        [16, 'DIECISEIS PESOS 00/100 M.N.'],
        [17, 'DIECISIETE PESOS 00/100 M.N.'],
        [20, 'VEINTE PESOS 00/100 M.N.'],
        [24, 'VEINTICUATRO PESOS 00/100 M.N.'],
        [30, 'TREINTA PESOS 00/100 M.N.'],
        [35, 'TREINTA Y CINCO PESOS 00/100 M.N.'],
        [40, 'CUARENTA PESOS 00/100 M.N.'],
        [46, 'CUARENTA Y SEIS PESOS 00/100 M.N.'],
        [50, 'CINCUENTA PESOS 00/100 M.N.'],
        [57, 'CINCUENTA Y SIETE PESOS 00/100 M.N.'],
        [60, 'SESENTA PESOS 00/100 M.N.'],
        [68, 'SESENTA Y OCHO PESOS 00/100 M.N.'],
        [70, 'SETENTA PESOS 00/100 M.N.'],
        [79, 'SETENTA Y NUEVE PESOS 00/100 M.N.'],
        [80, 'OCHENTA PESOS 00/100 M.N.'],
        [81, 'OCHENTA Y UN PESOS 00/100 M.N.'],
        [90, 'NOVENTA PESOS 00/100 M.N.'],
        [92, 'NOVENTA Y DOS PESOS 00/100 M.N.']
    ])('number teens to currency letters', (input: number, expected: string) => {
        expect(toCurrency(input)).toBe(expected);
    });

    test.each([
        [100, 'CIEN PESOS 00/100 M.N.'],
        [111, 'CIENTO ONCE PESOS 00/100 M.N.'],
        [200, 'DOSCIENTOS PESOS 00/100 M.N.'],
        [222, 'DOSCIENTOS VEINTIDOS PESOS 00/100 M.N.'],
        [300, 'TRESCIENTOS PESOS 00/100 M.N.'],
        [333, 'TRESCIENTOS TREINTA Y TRES PESOS 00/100 M.N.'],
        [400, 'CUATROCIENTOS PESOS 00/100 M.N.'],
        [444, 'CUATROCIENTOS CUARENTA Y CUATRO PESOS 00/100 M.N.'],
        [500, 'QUINIENTOS PESOS 00/100 M.N.'],
        [555, 'QUINIENTOS CINCUENTA Y CINCO PESOS 00/100 M.N.'],
        [600, 'SEISCIENTOS PESOS 00/100 M.N.'],
        [666, 'SEISCIENTOS SESENTA Y SEIS PESOS 00/100 M.N.'],
        [700, 'SETECIENTOS PESOS 00/100 M.N.'],
        [777, 'SETECIENTOS SETENTA Y SIETE PESOS 00/100 M.N.'],
        [800, 'OCHOCIENTOS PESOS 00/100 M.N.'],
        [888, 'OCHOCIENTOS OCHENTA Y OCHO PESOS 00/100 M.N.'],
        [900, 'NOVECIENTOS PESOS 00/100 M.N.'],
        [999, 'NOVECIENTOS NOVENTA Y NUEVE PESOS 00/100 M.N.']
    ])('number hundreds to currency letters', (input: number, expected: string) => {
        expect(toCurrency(input)).toBe(expected);
    });

    test.each([
        [1000, 'MIL PESOS 00/100 M.N.'],
        [1101, 'MIL CIENTO UN PESOS 00/100 M.N.'],
        [2000, 'DOS MIL PESOS 00/100 M.N.'],
        [13000, 'TRECE MIL PESOS 00/100 M.N.'],
        [50000, 'CINCUENTA MIL PESOS 00/100 M.N.'],
        [999999, 'NOVECIENTOS NOVENTA Y NUEVE MIL NOVECIENTOS NOVENTA Y NUEVE PESOS 00/100 M.N.']
    ])('number thousands to currency letters', (input: number, expected: string) => {
        expect(toCurrency(input)).toBe(expected);
    });

    test.each([
        [1000000, 'UN MILLÓN DE PESOS 00/100 M.N.'],
        [1001000, 'UN MILLÓN MIL PESOS 00/100 M.N.'],
        [2000000, 'DOS MILLONES DE PESOS 00/100 M.N.'],
        [20000000, 'VEINTE MILLONES DE PESOS 00/100 M.N.']
    ])('number millions to currency letters', (input: number, expected: string) => {
        expect(toCurrency(input)).toBe(expected);
    });

    test.each([
        [
            999999999999.99,
            'NOVECIENTOS NOVENTA Y NUEVE MIL NOVECIENTOS NOVENTA Y NUEVE MILLONES NOVECIENTOS NOVENTA Y NUEVE MIL NOVECIENTOS NOVENTA Y NUEVE PESOS 99/100 M.N.'
        ],
        [1000000000, 'MIL MILLONES DE PESOS 00/100 M.N.'],
        [500000000, 'QUINIENTOS MILLONES DE PESOS 00/100 M.N.']
    ])('number thousands of millions to currency letters', (input: number, expected: string) => {
        expect(toCurrency(input)).toBe(expected);
    });

    test('number to currency letters with decimals', () => {
        expect(toCurrency(1500.7)).toBe('MIL QUINIENTOS PESOS 70/100 M.N.');
        expect(toCurrency(2000.5)).toBe('DOS MIL PESOS 50/100 M.N.');
    });

    test('number to currency letters with custom moneda', () => {
        expect(toCurrency(1500)).toBe('MIL QUINIENTOS PESOS 00/100 M.N.');
        expect(toCurrency(1500, 'USD')).toBe('MIL QUINIENTOS PESOS 00/100 USD');
        expect(toCurrency(1500, 'MXN')).toBe('MIL QUINIENTOS PESOS 00/100 M.N.');
    });

    test('expect thrown on number great than 999,999,999,999.99', () => {
        expect(() => {
            toCurrency(999999999999.99 + 0.1);
        }).toThrow('El número es demasiado grande.');
    });

    test('format currency to only two decimals characters', () => {
        expect(formatCurrency('NA')).toBe('$0.00');
        expect(formatCurrency(1500)).toBe('$1,500.00');
        expect(formatCurrency(2000.5)).toBe('$2,000.50');
    });
});
