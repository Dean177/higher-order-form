import {
  maxLength,
  minLength,
} from './array'

describe('textValidators', () => {
  describe('maxLength', () => {
    it('returns error if over max length', () => {
      expect(maxLength(5)([1, 2, 3, 4, 5, 6]).length).toBeGreaterThan(0)
    })

    it('returns no error if at max length', () => {
      expect(maxLength(5)([1, 2, 3, 4, 5]).length).toBe(0)
    })
  })

  describe('minLength', () => {
    it('returns error under the min length', () => {
      expect(minLength(3)([1, 2]).length).toBeGreaterThan(0)
    })

    it('returns no error if equal to or over the min length', () => {
      expect(minLength(3)([1, 2, 3]).length).toBe(0)
    })
  })
})
