import {
  maxLength,
  minLength,
  validEmail,
} from './text'

describe('textValidators', () => {
  describe('maxLength', () => {
    const max = 5
    it('returns error if over max length', () => {
      const result = maxLength(max)('123456')
      expect(result.length).toBeGreaterThan(0)
    })

    it('returns no error if at max length', () => {
      const result = maxLength(max)('12345')
      expect(result.length).toBe(0)
    })
  })

  describe('minLength', () => {
    it('returns error under the min length', () => {
      expect(minLength(3)('2').length).toBeGreaterThan(0)
    })

    it('returns no error if equal to or over the min length', () => {
      expect(minLength(3)('123').length).toBe(0)
      expect(minLength(3)('1234').length).toBe(0)
    })
  })

  describe('validEmail', () => {
    it('returns error for invalid email', () => {
      const invalidEmailErrors = validEmail('Example Text Here')

      expect(invalidEmailErrors.length).toBeGreaterThan(0)
      expect(invalidEmailErrors[0]).toBe('Please enter a valid email')
    })

    it('returns no error for a valid email', () => {
      const result = validEmail('person@example.com')
      expect(result.length).toBe(0)
    })
  })
})
