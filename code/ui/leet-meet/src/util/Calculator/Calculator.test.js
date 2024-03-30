import { getOrdinal } from './Calculator';

test('that getOrdinal works', () => {
  expect(getOrdinal(1)).toBe('st');
  expect(getOrdinal(2)).toBe('nd');
  expect(getOrdinal(3)).toBe('rd');
  expect(getOrdinal(4)).toBe('th');
});
