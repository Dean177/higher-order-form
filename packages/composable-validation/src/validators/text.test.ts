import {
  maxLength,
  minLength,
  validEmail,
  trimmed,
} from './text'

describe('textValidators', () => {
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

  describe('trimmed', () => {
    describe('when used with minLength', () => {
      it('returns error if string right length but all whitespace', () => {
        expect(trimmed(minLength(3))('   ').length).toBeGreaterThan(0)
      })

      it('returns error if string right length but with initial or trailing whitespace', () => {
        expect(trimmed(minLength(3))(' 12').length).toBeGreaterThan(0)
        expect(trimmed(minLength(3))('12 ').length).toBeGreaterThan(0)
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
