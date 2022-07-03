const breakEveryNCharacters = (str = '', n = 86): string => {
    const arr = str.match(new RegExp(`.{1,${n}}`, 'g'));
    let result = str;
    if (arr) {
        result = arr.reduce((a, b) => {
            if (a.length + b.length < n) {
                return `${a}${b}`;
            }

            return `${a}\n${b}`;
        });
    }

    return result;
};

export { breakEveryNCharacters };
