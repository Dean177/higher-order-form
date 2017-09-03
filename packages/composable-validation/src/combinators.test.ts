import { endsWith, flatten, startsWith } from 'lodash';
import { optional, required, requiredWithMessage, rules } from './combinators'
import { validate, ValueValidator } from './validate'

export const minLength = (min: number): ValueValidator<string> =>
  (value: string) => value.length < min ? [`Must be at least ${min} characters`] : []

describe('required', () => {
  it('returns no error for some text', () => {
    const result = required(minLength(1))('a')
    expect(result.length).toBe(0)
  })

  it('returns no error for an empty array', () => {
    const missingErrors = required(minLength(0))([])
    expect(missingErrors.length).toBe(0)
  })

  it('returns no error for a filled array', () => {
    const validator = required(minLength(1));
    const errorsNumberArray = validator([3])
    const errorsStringArray = validator(['String'])
    const errorsOtherArray = validator([[]])

    expect(errorsNumberArray.length).toBe(0)
    expect(errorsStringArray.length).toBe(0)
    expect(errorsOtherArray.length).toBe(0)
  })

  it('returns error for null or undefined', () => {
    const nullErrors = required(null)
    const undefinedErrors = required(undefined as any)

    expect(nullErrors.length).toBeGreaterThan(0)
    expect(undefinedErrors.length).toBeGreaterThan(0)
  })

  it('will fail if no value is provided', () => {
    const validator = required(minLength(8))
    expect(validator(null).length).toBeGreaterThan(0)
  })

  it('will fail if a value is provided and the sub validators fail', () => {
    const validator = required(minLength(8))
    expect(validator('012').length).toBeGreaterThan(0)
  })

  it('will succeed if a value is provided and the sub validators pass', () => {
    const validator = required(minLength(8))
    expect(validator('01234567').length).toBe(0)
  })
})

describe('requiredWithMessage', () => {
  it('returns defined error message', () => {
    const validationMessage = 'Missing text!'
    const validator = requiredWithMessage(validationMessage)(minLength(5))
    const errors = validator(null)

    expect(errors[0]).toBe(validationMessage)
  })
})

describe('rules', () => {
  it('will return the result of all of the individual validators, combined into a single array', () => {
    const beginsWithA: ValueValidator<string> = (someString: string) =>
      startsWith(someString, 'a') ? ['starts with a'] : []
    const finishesWithC: ValueValidator<string>  = (someString: string) =>
      endsWith(someString, 'c') ? ['ends with c'] : []
    const lengthValidator: ValueValidator<string>  = (someString: string) =>
      someString.length === 0 ? ['required'] : []

    const combinedValidator: ValueValidator<string>  = rules(
      beginsWithA,
      finishesWithC,
      lengthValidator,
    )

    const sampleInput = 'abc'
    const validationResult: Array<string> = combinedValidator(sampleInput)

    expect(validationResult).toEqual(flatten([beginsWithA(sampleInput), finishesWithC(sampleInput)]))
  })
})

describe('optional', () => {
  it('will fail pass no value is provided', () => {
    const validator = optional(minLength(8))
    expect(validator(null).length).toBe(0)
  })

  it('will fail if a value is provided and the sub validators fail', () => {
    const validator = optional(minLength(8))
    expect(validator('012').length).toBeGreaterThan(0)
  })

  it('will succeed if a value is provided and the sub validators pass', () => {
    const validator = optional(minLength(8))
    expect(validator('01234567').length).toBe(0)
  })
})
