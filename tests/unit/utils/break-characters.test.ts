import { breakEveryNCharacters } from 'src/utils/break-characters';

describe('Name of the group', () => {
  test('brakes every 86 lines not checking | and +', () => {
    const breakEach = 86;
    const string_ =
      'hsHwe8CjQpNClpK6d8FqyONW1OsDjMATXYN29ldPz1KseRy6E0SRcI42VKbg184xTaZhDrhFdgr1a5VH1ufaFZBr3m3fPOWUOG+feb3iMZZZH2UQoELqUn3c+6ZVFgAW9ksttIeKvxbGWsFIAB8A/b+dC58mPvIfOFVksmCIqaQ8';

    const result2 = breakEveryNCharacters(string_, breakEach);

    const arrayResult = result2.split('\n');
    for (const line of arrayResult) {
      expect(line.length).toBe(86);
    }
  });

  test('brakes default', () => {
    const string_ =
      'hsHwe8CjQpNClpK6d8FqyONW1OsDjMATXYN29ldPz1KseRy6E0SRcI42VKbg184xTaZhDrhFdgr1a5VH1ufaFZBr3m3fPOWUOG+feb3iMZZZH2UQoELqUn3c+6ZVFgAW9ksttIeKvxbGWsFIAB8A/b+dC58mPvIfOFVksmCIqaQ8';

    const result2 = breakEveryNCharacters(string_);

    const arrayResult = result2.split('\n');
    for (const line of arrayResult) {
      expect(line.length).toBe(86);
    }
  });

  test('brakes is minor or equal to specific characters break', () => {
    const n = 100;
    const string_ =
      'hsHwe8CjQpNClpK6d8FqyONW1OsDjMATXYN29ldPz1KseRy6E0SRcI42VKbg184xTaZhDrhFdgr1a5VH1ufaFZBr3m3fPOWUOG+';

    const result2 = breakEveryNCharacters(string_, n);

    const arrayResult = result2.split('\n');
    for (const line of arrayResult) {
      expect(line.length).toBeLessThanOrEqual(n);
    }
  });

  test('return empty on empty input', () => {
    expect(breakEveryNCharacters('')).toBe('');
  });
});
