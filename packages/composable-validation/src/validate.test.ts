import { validate, ValueValidator, Validator, hasValidationErrors } from './validate'

export const maxLength = (max: number): ValueValidator<string | null> =>
  (value: string | null) => (value != null && value.length > max) ? [`Text must be less than ${max} characters`] : []

export const minLength = (min: number): ValueValidator<string> =>
  (value: string) => value.length < min ? [`Must be at least ${min} characters`] : []

describe('validate', () => {
  it('accepts a ValueValidator, and will return an array of errors', () => {
    expect(validate(minLength(10), 'fail').length).toBeGreaterThan(0);
  });

  it('returns an object with key value pairs for values which fail validation', () => {
    type MyObject = { name: string }
    const constraints: Validator<MyObject> = { name: minLength(5) }
    const validationResult = (validate(constraints, { name: '' })).name
    expect(validationResult && validationResult.length).toBeGreaterThan(0)
  })

  it('accepts an NestedValidator, returning a ValidationResult', () => {
    const result = validate({ name: minLength(11) }, { name: 'fail' });
    expect(result.name.length).toBeGreaterThan(0);
  })

  it('works with nested ObjectValidators', () => {
    type TestObject = {
      name: string,
      address: {
        postcode: string,
      },
    }
    const constraints: Validator<TestObject> = {
      name: maxLength(10),
      address: {
        postcode: minLength(5),
      },
    }
    const result = validate(constraints, { name: '', address: { postcode: '' } })

    expect(result.name).toBeUndefined()
    expect(result.address.postcode.length).toBeGreaterThan(0)
  })

  it('returns an object which only has keys for values that have validation errors', () => {
    type OtherObject = {
      name: string,
      validKey: number,
    }
    const constraints: Validator<OtherObject> = {
      name: minLength(5),
      validKey: (number: number) => [],
    }
    const validationResult = (validate(constraints, { name: '', validKey: 6 }))

    expect(validationResult.name.length).toBeGreaterThan(0)
    expect(validationResult.validKey).toBeUndefined()
  })
})

describe('hasValidationErrors', () => {
  it('returns true if the object any non-empty errors', () => {
    expect(hasValidationErrors({ key: ['error'], otherKey: [] })).toBe(true)
  })

  it('returns false if the object has no keys', () => {
    expect(hasValidationErrors({})).toBe(false)
  })

  it('returns false when all properties are empty arrays', () => {
    expect(hasValidationErrors({ ant: [] })).toBe(false)
  })

  it('returns false when all properties are empty arrays or empty objects', () => {
    expect(hasValidationErrors({ ant: [], bat: {} })).toBe(false)
  })

  it('returns false when all nested properties are empty arrays or empty objects', () => {
    expect(hasValidationErrors({ ant: [], bat: {}, cat: { dog: [] } })).toBe(false)
  })

  it('returns true when any property is a non-empty array', () => {
    expect(hasValidationErrors({ ant: ['fail'] })).toBe(true)
    expect(hasValidationErrors({ ant: ['fail'], bat: [] })).toBe(true)
  })

  it('returns true when any nested property is a non-empty array', () => {
    expect(hasValidationErrors({ ant: [], bat: { cat: ['fail'] } })).toBe(true)
    expect(hasValidationErrors({ ant: [], bat: { cat: [], dog: ['fail'] } })).toBe(true)
  })
})

