import {
  maxLength,
  minLength,
} from './textValidators';

describe('textValidators', () => {
  describe('maxLength', () => {
    const max = 5;
    it('returns error if over max length', () => {
      const result = maxLength(max)('123456');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns no error if at max length', () => {
      const result = maxLength(max)('12345');
      expect(result.length).toBe(0);
    });
  });

  describe('minLength', () => {
    const min = 3;
    it('returns error under the min length', () => {
      const result = minLength(min)('12');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns no error if equal to or over the min length', () => {
      const result = minLength(min)('123');
      expect(result.length).toBe(0);
    });
  });
});
