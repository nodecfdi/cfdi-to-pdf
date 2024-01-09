const breakEveryNCharacters = (string_: string, n = 86): string => {
  const array = new RegExp(`.{1,${n}}`, 'g').exec(string_);
  let result = string_;
  if (array) {
    // eslint-disable-next-line unicorn/no-array-reduce
    result = array.reduce((a, b) => {
      return `${a}\n${b}`;
    });
  }

  return result;
};

export { breakEveryNCharacters };
