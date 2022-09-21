const normalizeSpace = (value: string): string => {
    return value.replace(/\s+/g, ' ').trim();
};

export { normalizeSpace };
