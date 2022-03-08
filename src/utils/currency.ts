const getGroupToCurrency = (group: string): string => {
    // necessary arrays needed to convert from numbers to currency
    const basics = [
        'cero',
        'un',
        'dos',
        'tres',
        'cuatro',
        'cinco',
        'seis',
        'siete',
        'ocho',
        'nueve',
        'diez',
        'once',
        'doce',
        'trece',
        'catorce',
        'quince',
    ];
    const teens = [
        '',
        'dieci',
        'veinti',
        'treinta',
        'cuarenta',
        'cincuenta',
        'sesenta',
        'setenta',
        'ochenta',
        'noventa',
    ];
    const hundreds = [
        '',
        'ciento',
        'doscientos',
        'trescientos',
        'cuatrocientos',
        'quinientos',
        'seiscientos',
        'setecientos',
        'ochocientos',
        'novecientos',
    ];
    // variable used to temporarily store currency
    let toCurrency = '';
    // handle hundreds
    if (group.length === 3) {
        switch (parseInt(group, 10)) {
            case 100:
                return 'cien ';
            case 0:
                return '';
            default:
                toCurrency += `${hundreds[parseInt(group[0], 10)]} `;
        }
        // eslint-disable-next-line
        group = group.substring(1, 3);
    }
    // handle teens and 'basic' numbers
    if (parseInt(group, 10) <= 15) {
        // if group is less than 15, select from basics array
        if (group === '00') {
            return toCurrency;
        }
        toCurrency += `${basics[parseInt(group, 10)]} `;
    } else {
        // else look for the number in both teens and basics arrays
        const zeroAtTheEnd = group[1] === '0';
        switch (parseInt(group, 10)) {
            case 20:
                return `${toCurrency}veinte `;
            default:
                toCurrency += `${
                    teens[parseInt(group[0], 10)] +
                    (parseInt(group[0], 10) >= 3 && !zeroAtTheEnd ? ' y ' : '') +
                    (zeroAtTheEnd ? '' : basics[parseInt(group[1], 10)])
                } `;
        }
    }
    // return result
    return toCurrency;
};

const toCurrency = (num: number, moneda?: string): string => {
    // number to string
    const number = num.toFixed(2);
    // separate decimals (only 2) and integers
    let integers = number.substring(0, number.indexOf('.'));
    const decimals = number.substring(number.indexOf('.') + 1, number.length);
    const monedaName = !moneda || moneda === 'MXN' ? 'M.N.' : moneda;
    // initialize string to store currency
    let numberToCurrency = '';
    // some helpful variables
    let noThousands = false;
    let noHundreds = false;
    let thousandsOfMillions = false;
    // Maximum supported number is 999,999,999,999.99
    if (integers.length <= 12) {
        // evaluate each group of 3 digits (hundreds, thousands, millions, thousands of millions)
        // evaluate thousands of millions
        if (integers.length === 12 || integers.length === 11 || integers.length === 10) {
            const group = integers.substring(0, integers.length - 9);
            thousandsOfMillions = true;
            switch (parseInt(group, 10)) {
                case 0:
                    break;
                case 1:
                    numberToCurrency += 'mil ';
                    break;
                default:
                    numberToCurrency += `${getGroupToCurrency(group)}mil `;
            }
            integers = integers.substring(integers.length - 9, integers.length);
        }
        // evaluate millions
        if (integers.length === 9 || integers.length === 8 || integers.length === 7) {
            const group = integers.substring(0, integers.length - 6);
            numberToCurrency += getGroupToCurrency(group);
            if (!thousandsOfMillions && parseInt(group, 10) === 1) {
                numberToCurrency += 'millón ';
            } else {
                numberToCurrency += 'millones ';
            }
            integers = integers.substring(integers.length - 6, integers.length);
        }
        // evaluate thousands
        if (integers.length === 6 || integers.length === 5 || integers.length === 4) {
            const group = integers.substring(0, integers.length - 3);
            noThousands = parseInt(group, 10) === 0;
            switch (parseInt(group, 10)) {
                case 0:
                    break;
                case 1:
                    numberToCurrency += 'mil ';
                    break;
                default:
                    numberToCurrency += `${getGroupToCurrency(group)}mil `;
            }
            integers = integers.substring(integers.length - 3, integers.length);
        }
        // evaluate hundreds
        noHundreds = parseInt(integers, 10) === 0;
        numberToCurrency += getGroupToCurrency(integers);
        numberToCurrency += `${
            (noThousands && noHundreds ? 'de ' : '') + (numberToCurrency === 'un ' ? 'peso ' : 'pesos ') + decimals
        }/100 ${monedaName}`;
        return numberToCurrency.toUpperCase();
    } else {
        throw new Error('El número es demasiado grande.');
    }
};

export { toCurrency };
