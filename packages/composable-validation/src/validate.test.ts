import { endsWith, flatten, startsWith } from 'lodash';
import { rules, validate, ValueValidator, Validator, required, optional, hasValidationErrors } from './validate';

export const maxLength = (max: number): ValueValidator<string | null> =>
  (value: string | null) => (value != null && value.length > max) ? [`Text must be less than ${max} characters`] : [];

export const minLength = (min: number): ValueValidator<string> =>
  (value: string) => value.length < min ? [`Must be at least ${min} characters`] : [];

describe('rules', () => {
  it('will return the result of all of the individual validators, combined into a single array', () => {
    const beginsWithA: ValueValidator<string> = (someString: string) =>
      startsWith(someString, 'a') ? ['starts with a'] : [];
    const finishesWithC: ValueValidator<string>  = (someString: string) =>
      endsWith(someString, 'c') ? ['ends with c'] : [];
    const lengthValidator: ValueValidator<string>  = (someString: string) =>
      someString.length === 0 ? ['required'] : [];

    const combinedValidator: ValueValidator<string>  = rules(
      beginsWithA,
      finishesWithC,
      lengthValidator,
    );

    const sampleInput = 'abc';
    const validationResult: Array<string> = combinedValidator(sampleInput);

    expect(validationResult).toEqual(flatten([beginsWithA(sampleInput), finishesWithC(sampleInput)]));
  });
});

describe('hasValidationErrors', () => {
  it('returns false when given an empty object', () => {
    expect(hasValidationErrors({})).toBe(false);
  });

  it('returns true when any property is invalid', () => {
    expect(hasValidationErrors({ foo: ['fail']})).toBe(true);
  });
})

describe('validate', () => {
  it('returns an object whose keys represent', () => {
    interface MyObject { name: string }
    const constraints: Validator<MyObject> = { name: rules(minLength(5), maxLength(10)) };
    const validationResult = (validate(constraints, { name: '' }) as any).name;

    expect((validationResult && validationResult.length)).toBeGreaterThan(0);
  });
});

describe('required', () => {
  it('will fail if no value is provided', () => {
    const validator = required(minLength(8));
    expect(validator(null).length).toBeGreaterThan(0);
  });

  it('will fail if a value is provided and the sub validators fail', () => {
    const validator = required(minLength(8));
    expect(validator('012').length).toBeGreaterThan(0);
  });

  it('will succeed if a value is provided and the sub validators pass', () => {
    const validator = required(minLength(8));
    expect(validator('01234567').length).toBe(0);
  });
});

describe('optional', () => {
  it('will fail pass no value is provided', () => {
    const validator = optional(minLength(8));
    expect(validator(null).length).toBe(0);
  });

  it('will fail if a value is provided and the sub validators fail', () => {
    const validator = optional(minLength(8));
    expect(validator('012').length).toBeGreaterThan(0);
  });

  it('will succeed if a value is provided and the sub validators pass', () => {
    const validator = optional(minLength(8));
    expect(validator('01234567').length).toBe(0);
  });
});
