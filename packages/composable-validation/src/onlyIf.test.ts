import onlyIf from './onlyIf'

describe('onlyIf', () => {
  const alwaysError = (value: string) => [value]
  it('returns errors from its validator if the conditional is truthy', () => {
    const result = onlyIf(true, alwaysError)('some string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('returns errors from its validator if the conditional function is truthy', () => {
    const result = onlyIf(() => true, alwaysError)('some string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('returns no errors if the condition is falsy', () => {
    const result = onlyIf(false, alwaysError)('some string')
    expect(result.length).toBe(0)
  })

  it('returns no errors if the condition function is falsy', () => {
    const result = onlyIf(() => false, alwaysError)('some string')
    expect(result.length).toBe(0)
  })
})
