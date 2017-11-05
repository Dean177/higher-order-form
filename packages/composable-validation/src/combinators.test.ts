import { endsWith, flatten, includes as includesLd, startsWith } from 'lodash';
import * as array from './validators/array'
import { onlyIf, optional, required, requiredWithMessage, rules } from './combinators'
import { validate, ValueValidator } from './validate'

const includes = <T>(matchingValue: T): ValueValidator<Array<T>> => (value) =>
  includesLd(value, matchingValue) ? [`Must include ${matchingValue}`] : []

const minLength = (min: number): ValueValidator<string> =>
  (value: string) => value.length < min ? [`Must be at least ${min} in length`] : []

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

  it('The predicate has the value passed to it', () => {
    const nestedValue = { bat: 'two', cat: 'three' }
    const model = { ant: nestedValue }
    const spy = jest.fn();
    const validator = {
      ant: onlyIf(
        (nv) => {
          spy(nv);
          return false;
        },
        {
          bat: minLength(2),
          cat: minLength(3),
        }
      )}

      validate(validator, model)

      expect(spy).toHaveBeenCalledWith(nestedValue)
  })
})

describe('required', () => {
  it('returns no error for some text', () => {
    expect(required()('a').length).toBe(0)
    expect(required(minLength(1))('a').length).toBe(0)
  })

  it('returns an error for an empty array', () => {
    expect(required()([]).length).toBeGreaterThan(0)
    expect(required(array.maxLength(6))([]).length).toBeGreaterThan(0)
  })

  it('returns no error for a filled array', () => {
    const errorsNumberArray = required(array.minLength(1))([1, 2])
    expect(errorsNumberArray.length).toBe(0)

    const errorsStringArray =required()(['String'])
    expect(errorsStringArray.length).toBe(0)

    const errorsOtherArray = required()([[]])
    expect(errorsOtherArray.length).toBe(0)
  })

  it('returns error for null or undefined', () => {
    const nullErrors = required()(null)
    const undefinedErrors = required()(undefined as any)

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
