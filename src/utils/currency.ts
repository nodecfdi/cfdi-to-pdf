const getGroupToCurrency = (group: string): string => {
  // Necessary arrays needed to convert from numbers to currency
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
  // Variable used to temporarily store currency
  let toCurrency = '';
  // Handle hundreds
  if (group.length === 3) {
    switch (Number.parseInt(group, 10)) {
      case 100: {
        return 'cien ';
      }

      case 0: {
        return '';
      }

      default: {
        toCurrency += `${hundreds[Number.parseInt(group[0], 10)]} `;
      }
    }

    group = group.slice(1, 3);
  }

  // Handle teens and 'basic' numbers
  if (Number.parseInt(group, 10) <= 15) {
    // If group is less than 15, select from basics array
    if (group === '00') {
      return toCurrency;
    }

    toCurrency += `${basics[Number.parseInt(group, 10)]} `;
  } else {
    // Else look for the number in both teens and basics arrays
    const zeroAtTheEnd = group[1] === '0';
    if (Number.parseInt(group, 10) === 20) {
      return `${toCurrency}veinte `;
    }

    toCurrency += `${
      teens[Number.parseInt(group[0], 10)] +
      (Number.parseInt(group[0], 10) >= 3 && !zeroAtTheEnd ? ' y ' : '') +
      (zeroAtTheEnd ? '' : basics[Number.parseInt(group[1], 10)])
    } `;
  }

  return toCurrency;
};

// eslint-disable-next-line complexity
const toCurrency = (number_: number, moneda?: string): string => {
  // Number to string
  const number = number_.toFixed(2);
  // Separate decimals (only 2) and integers
  let integers = number.slice(0, Math.max(0, number.indexOf('.')));
  const decimals = number.slice(number.indexOf('.') + 1, number.length);
  const monedaName = !moneda || moneda === 'MXN' ? 'M.N.' : moneda;
  // Initialize string to store currency
  let numberToCurrency = '';
  // Some helpful variables
  let noThousands = false;
  let noHundreds = false;
  let thousandsOfMillions = false;
  // Maximum supported number is 999,999,999,999.99
  if (integers.length <= 12) {
    // Evaluate each group of 3 digits (hundreds, thousands, millions, thousands of millions)
    // Evaluate thousands of millions
    if (integers.length === 12 || integers.length === 11 || integers.length === 10) {
      const group = integers.slice(0, Math.max(0, integers.length - 9));
      thousandsOfMillions = true;
      switch (Number.parseInt(group, 10)) {
        /* istanbul ignore next */
        case 0: {
          break;
        }

        case 1: {
          numberToCurrency += 'mil ';
          break;
        }

        default: {
          numberToCurrency += `${getGroupToCurrency(group)}mil `;
        }
      }

      integers = integers.slice(-9, integers.length);
    }

    // Evaluate millions
    if (integers.length === 9 || integers.length === 8 || integers.length === 7) {
      const group = integers.slice(0, Math.max(0, integers.length - 6));
      numberToCurrency += getGroupToCurrency(group);
      numberToCurrency +=
        !thousandsOfMillions && Number.parseInt(group, 10) === 1 ? 'millón ' : 'millones ';
      integers = integers.slice(-6, integers.length);
    }

    // Evaluate thousands
    if (integers.length === 6 || integers.length === 5 || integers.length === 4) {
      const group = integers.slice(0, Math.max(0, integers.length - 3));
      noThousands = Number.parseInt(group, 10) === 0;
      switch (Number.parseInt(group, 10)) {
        case 0: {
          break;
        }

        case 1: {
          numberToCurrency += 'mil ';
          break;
        }

        default: {
          numberToCurrency += `${getGroupToCurrency(group)}mil `;
        }
      }

      integers = integers.slice(-3, integers.length);
    }

    // Evaluate hundreds
    noHundreds = Number.parseInt(integers, 10) === 0;
    numberToCurrency += getGroupToCurrency(integers);
    numberToCurrency += `${
      (noThousands && noHundreds ? 'de ' : '') +
      (numberToCurrency === 'un ' ? 'peso ' : 'pesos ') +
      decimals
    }/100 ${monedaName}`;

    return numberToCurrency.toUpperCase();
  }

  throw new Error('El número es demasiado grande.');
};

const toNumber = (currency: number | string): number => {
  if (typeof currency === 'string') {
    currency = Number(currency);
  }

  return Number.isNaN(currency) ? 0 : Number(currency);
};

const formatCurrency = (currency: number | string): string => {
  const number = toNumber(currency);

  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
  }).format(number);
};

export { toCurrency, formatCurrency, toNumber };
