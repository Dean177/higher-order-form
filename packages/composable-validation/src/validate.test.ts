import { endsWith, flatten, startsWith } from 'lodash';
import { rules, validate, ValueValidator, ObjectValidator } from './validate';
import { maxLength } from '../../composable-validation-validators/src/textValidators';

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
  it('accepts a ValueValidator, and will return an array of errors', () => {
    expect(validate(minLength(10), 'fail').length).toBeGreaterThan(0);
  });

  it('accepts an ObjectValidator, returning a ValidationResult', () => {
    expect(validate({ name: minLength(11) }, { name: 'fail' })).toBe({ name: [] });
  });

  it('works with nested ObjectValidators', () => {
    const constraints = {
      name: rules(minLength(5), maxLength(10)),
      address: {
        postcode: maxLength(5),
      },
    };
    const result: any = validate(constraints, { name: '', address: { postcode: '' } }) as any;

    expect(result.name.length).toBeGreaterThan(0);
    expect(result.address.postcode).toBeGreaterThan(0);
  });
});
