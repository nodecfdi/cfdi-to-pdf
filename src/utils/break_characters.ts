const breakCharacters = (raw: string, separator = '\u{200B}'): string => {
  return [...raw].join(separator);
};

export default breakCharacters;
