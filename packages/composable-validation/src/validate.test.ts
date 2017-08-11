import { endsWith, flatten, startsWith } from 'lodash';
import { hasValidationErrors, rules, validate, ValueValidator, Validator } from './validate';

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

describe('validate', () => {
  it('returns an object with key value pairs for values which fail validation', () => {
    type MyObject = { name: string };
    const constraints: Validator<MyObject> = { name: rules(minLength(5), maxLength(10)) };
    const validationResult = (validate(constraints, { name: '' }) as any).name;

    expect(validationResult && validationResult.length).toBeGreaterThan(0);
  });

  it('returns an object which only has keys for values that have validation errors', () => {
    type OtherObject = { name: string, validKey: number };
    const constraints: Validator<OtherObject> = {
      name: rules(minLength(5), maxLength(10)),
      validKey: (number: number) => [],
    };
    const validationResult = (validate(constraints, { name: '', validKey: 6 }) as any);

    expect(validationResult.name.length).toBeGreaterThan(0);
    expect(validationResult.validKey).toBeUndefined();
  })
});

describe('hasValidationErrors', () => {
  it('returns true if the object any non-empty errors', () => {
    expect(hasValidationErrors({ key: ['error'], otherKey: [] })).toBe(true);
  });

  it('returns false if the object has no keys', () => {
    expect(hasValidationErrors({})).toBe(false);
  });

  it('returns false if all ValidationErrors are empty', () => {
    expect(hasValidationErrors({ someKey: [] })).toBe(false);
  });
});
