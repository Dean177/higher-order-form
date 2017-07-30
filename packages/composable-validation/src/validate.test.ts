import { endsWith, flatten, startsWith } from 'lodash';
import { rules, validate, ValueValidator, Validator } from './validate';

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
  it('returns an object whose keys represent', () => {
    interface MyObject { name: string }
    const constraints: Validator<MyObject> = { name: rules(minLength(5), maxLength(10)) };
    const validationResult = (validate(constraints, { name: '' }) as any).name;

    expect((validationResult && validationResult.length)).toBeGreaterThan(0);
  });
});
