/* eslint-disable security/detect-non-literal-regexp */
const breakEveryNCharacters = (raw: string, n = 86, separator = '\u{200B}'): string => {
  const regex = new RegExp(`.{1,${n}}`, 'g');
  const parts = raw.match(regex) ?? [];

  return parts.join(separator);
};

export default breakEveryNCharacters;
