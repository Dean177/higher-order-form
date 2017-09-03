import validEmail from './validEmail'

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
