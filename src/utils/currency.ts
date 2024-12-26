const getGroupToCurrency = (rawGroup: string): string => {
  let group = rawGroup;
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
  const teens = ['', 'dieci', 'veinti', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
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
  let temporalCurrency = '';
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
        temporalCurrency += `${hundreds[Number.parseInt(group[0], 10)]} `;
      }
    }

    group = group.slice(1, 3);
  }

  // Handle teens and 'basic' numbers
  if (Number.parseInt(group, 10) <= 15) {
    // If group is less than 15, select from basics array
    if (group === '00') {
      return temporalCurrency;
    }

    temporalCurrency += `${basics[Number.parseInt(group, 10)]} `;
  } else {
    // Else look for the number in both teens and basics arrays
    const zeroAtTheEnd = group[1] === '0';
    if (Number.parseInt(group, 10) === 20) {
      return `${temporalCurrency}veinte `;
    }

    temporalCurrency += `${
      teens[Number.parseInt(group[0], 10)] +
      (Number.parseInt(group[0], 10) >= 3 && !zeroAtTheEnd ? ' y ' : '') +
      (zeroAtTheEnd ? '' : basics[Number.parseInt(group[1], 10)])
    } `;
  }

  return temporalCurrency;
};

const evaluateThousandsOfMillions = (
  integers: string,
  numberToCurrency: string,
): { numberToCurrency: string; integers: string } => {
  const group = integers.slice(0, Math.max(0, integers.length - 9));
  let fixedNumberToCurrency = numberToCurrency;
  switch (Number.parseInt(group, 10)) {
    /* istanbul ignore next */
    case 0: {
      break;
    }

    case 1: {
      fixedNumberToCurrency += 'mil ';
      break;
    }

    default: {
      fixedNumberToCurrency += `${getGroupToCurrency(group)}mil `;
    }
  }

  return {
    numberToCurrency: fixedNumberToCurrency,
    integers: integers.slice(-9),
  };
};

const evaluateMillions = (
  integers: string,
  numberToCurrency: string,
  thousandsOfMillions: boolean,
): { numberToCurrency: string; integers: string } => {
  let fixedNumberToCurrency = numberToCurrency;
  const group = integers.slice(0, Math.max(0, integers.length - 6));
  fixedNumberToCurrency += getGroupToCurrency(group);
  fixedNumberToCurrency += !thousandsOfMillions && Number.parseInt(group, 10) === 1 ? 'millón ' : 'millones ';

  return {
    numberToCurrency: fixedNumberToCurrency,
    integers: integers.slice(-6),
  };
};

export const toCurrency = (initial: number, moneda = 'MXN'): string => {
  // Number to string
  const number = initial.toFixed(2);
  // Separate decimals (only 2) and integers
  let integers = number.slice(0, Math.max(0, number.indexOf('.')));
  const decimals = number.slice(number.indexOf('.') + 1);
  const monedaName = moneda === 'MXN' ? 'M.N.' : moneda;
  // Initialize string to store currency
  let numberToCurrency = '';
  // Some helpful variables
  let noThousands = false;
  let noHundreds = false;
  let thousandsOfMillions = false;
  // Maximum supported number is 999,999,999,999.99
  if (integers.length > 12) {
    throw new Error('El número es demasiado grande.');
  }

  // Evaluate each group of 3 digits (hundreds, thousands, millions, thousands of millions)
  // Evaluate thousands of millions
  if (integers.length === 12 || integers.length === 11 || integers.length === 10) {
    thousandsOfMillions = true;
    const result = evaluateThousandsOfMillions(integers, numberToCurrency);
    integers = result.integers;
    numberToCurrency = result.numberToCurrency;
  }

  // Evaluate millions
  if (integers.length === 9 || integers.length === 8 || integers.length === 7) {
    const result = evaluateMillions(integers, numberToCurrency, thousandsOfMillions);
    integers = result.integers;
    numberToCurrency = result.numberToCurrency;
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

    integers = integers.slice(-3);
  }

  // Evaluate hundreds
  noHundreds = Number.parseInt(integers, 10) === 0;
  numberToCurrency += getGroupToCurrency(integers);
  numberToCurrency += `${
    (noThousands && noHundreds ? 'de ' : '') + (numberToCurrency === 'un ' ? 'peso ' : 'pesos ') + decimals
  }/100 ${monedaName}`;

  return numberToCurrency.toUpperCase();
};

export const toNumber = (currency: number | string): number => {
  let fixedCurrency = currency;
  if (typeof fixedCurrency === 'string') {
    fixedCurrency = Number(fixedCurrency);
  }

  return Number.isNaN(fixedCurrency) ? 0 : Number(fixedCurrency);
};

export const formatCurrency = (currency: number | string, currencyDisplay: 'symbol' | 'code' = 'symbol'): string => {
  const number = toNumber(currency);

  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay,
  })
    .format(number)
    .replace('USD', '')
    .trim();
};
