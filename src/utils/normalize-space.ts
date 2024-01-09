const normalizeSpace = (value: string): string => {
  return value.replaceAll(/\s+/g, ' ').trim();
};

export { normalizeSpace };
