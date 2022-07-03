import { breakEveryNCharacters } from '~/index';

describe('Name of the group', () => {
    test('brakes every 86 lines not checking | and +', () => {
        const breakEach = 86;
        const str =
            'hsHwe8CjQpNClpK6d8FqyONW1OsDjMATXYN29ldPz1KseRy6E0SRcI42VKbg184xTaZhDrhFdgr1a5VH1ufaFZBr3m3fPOWUOG+feb3iMZZZH2UQoELqUn3c+6ZVFgAW9ksttIeKvxbGWsFIAB8A/b+dC58mPvIfOFVksmCIqaQ8';

        const result2 = breakEveryNCharacters(str, breakEach);

        const arrayResult = result2.split('\n');
        arrayResult.forEach((line) => {
            expect(line.length).toBe(86);
        });
    });
});
