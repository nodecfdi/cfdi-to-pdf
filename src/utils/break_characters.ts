/* eslint-disable security/detect-non-literal-regexp */
const breakEveryNCharacters = (raw: string, n = 86, separator = '\u{200B}'): string => {
  const regex = String.raw`[\s\S]{1,${n}}`;
  const parts = new RegExp(regex, 'g').exec(raw) ?? [];

  return parts.join(separator);
};

export default breakEveryNCharacters;
