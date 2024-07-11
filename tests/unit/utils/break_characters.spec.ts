import breakEveryNCharacters from '#src/utils/break_characters';

describe('break characters', () => {
  test('brakes every 86 lines not checking | and +', () => {
    const breakEach = 86;
    const rawString =
      'hsHwe8CjQpNClpK6d8FqyONW1OsDjMATXYN29ldPz1KseRy6E0SRcI42VKbg184xTaZhDrhFdgr1a5VH1ufaFZBr3m3fPOWUOG+feb3iMZZZH2UQoELqUn3c+6ZVFgAW9ksttIeKvxbGWsFIAB8A/b+dC58mPvIfOFVksmCIqaQ8';

    const result2 = breakEveryNCharacters(rawString, breakEach);

    const arrayResult = result2.split('\u{200B}');
    for (const line of arrayResult) {
      expect(line).toHaveLength(86);
    }
  });

  test('brakes default', () => {
    const rawString =
      'hsHwe8CjQpNClpK6d8FqyONW1OsDjMATXYN29ldPz1KseRy6E0SRcI42VKbg184xTaZhDrhFdgr1a5VH1ufaFZBr3m3fPOWUOG+feb3iMZZZH2UQoELqUn3c+6ZVFgAW9ksttIeKvxbGWsFIAB8A/b+dC58mPvIfOFVksmCIqaQ8';

    const result2 = breakEveryNCharacters(rawString);

    const arrayResult = result2.split('\u{200B}');
    for (const line of arrayResult) {
      expect(line).toHaveLength(86);
    }
  });

  test('brakes is minor or equal to specific characters break', () => {
    const n = 100;
    const rawString =
      'hsHwe8CjQpNClpK6d8FqyONW1OsDjMATXYN29ldPz1KseRy6E0SRcI42VKbg184xTaZhDrhFdgr1a5VH1ufaFZBr3m3fPOWUOG+';

    const result2 = breakEveryNCharacters(rawString, n);

    const arrayResult = result2.split('\u{200B}');
    for (const line of arrayResult) {
      expect(line.length).toBeLessThanOrEqual(n);
    }
  });

  test('return empty on empty input', () => {
    expect(breakEveryNCharacters('')).toBe('');
  });
});
