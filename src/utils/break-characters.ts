const breakEveryNCharacters = (str = '', n = 86, checkPipesAndPlus = true): string => {
    const arr = str.match(new RegExp(`.{1,${n}}`, 'g'));
    let result = str;
    if (arr) {
        result = arr.reduce((a, b) => {
            if (checkPipesAndPlus) {
                const check = b.substring(0, Math.floor(n / 3));
                if(a.length + b.length < n || check.includes('+') || check.includes('|')) return `${a}${b}`;
            }
            return `${a}\n${b}`;
        });
    }
    return result;
};

export { breakEveryNCharacters };
