import {
  maxLength,
  minLength,
} from './array'

describe('textValidators', () => {
  describe('maxLength', () => {
    const max = 5
    it('returns error if over max length', () => {
      const result = maxLength(max)([1, 2, 3, 4, 5, 6])
      expect(result.length).toBeGreaterThan(0)
    })

    it('returns no error if at max length', () => {
      const result = maxLength(max)([1, 2, 3, 4, 5])
      expect(result.length).toBe(0)
    })
  })

  describe('minLength', () => {
    const min = 3
    it('returns error under the min length', () => {
      const result = minLength(min)([1,2,3])
      expect(result.length).toBeGreaterThan(0)
    })

    it('returns no error if equal to or over the min length', () => {
      const result = minLength(min)([1, 2, 3])
      expect(result.length).toBe(0)
    })
  })
})
