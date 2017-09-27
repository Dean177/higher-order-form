import {
  maxValue,
  minValue,
} from './numberValidators'

describe('numberValidators', () => {
  describe('maxValue', () => {
    const max = 5
    it('returns error if over max value', () => {
      const result = maxValue(max)(6)
      expect(result.length).toBeGreaterThan(0)
    })

    it('returns no error if at max value', () => {
      const result = maxValue(max)(max)
      expect(result.length).toBe(0)
    })
  })

  describe('minLength', () => {
    const min = 3
    it('returns error under the min value', () => {
      const result = minValue(min)(1)
      expect(result.length).toBeGreaterThan(0)
    })

    it('returns no error if equal to or over the min length', () => {
      const result = minValue(min)(min)
      expect(result.length).toBe(0)
    })
  })
})
