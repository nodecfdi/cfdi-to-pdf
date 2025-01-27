const breakCharacters = (raw: string, separator = '\u{200B}'): string => {
  return [...new Intl.Segmenter().segment(raw)].map((segment) => segment.segment).join(separator);
};

export default breakCharacters;
