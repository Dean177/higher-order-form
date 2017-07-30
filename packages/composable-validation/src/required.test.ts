import { required, requiredWithMessage } from './required';

describe('required', () => {
  it('returns error for missing text', () => {
    const missing1Errors = required('');
    const missing2Errors = required('   ');

    expect(missing1Errors.length).toBeGreaterThan(0);
    expect(missing2Errors.length).toBeGreaterThan(0);
  });

  it('returns no error for some text', () => {
    const result = required('a');
    expect(result.length).toBe(0);
  });

  it('returns error for an empty array', () => {
    const missingErrors = required([]);
    expect(missingErrors.length).toBeGreaterThan(0);
  });

  it('returns no error for a filled array', () => {
    const errorsNumberArray = required([3]);
    const errorsStringArray = required(['String']);
    const errorsOtherArray = required([[]]);

    expect(errorsNumberArray.length).toBe(0);
    expect(errorsStringArray.length).toBe(0);
    expect(errorsOtherArray.length).toBe(0);
  });

  it('returns error for null or undefined', () => {
    const nullErrors = required(null);
    const undefinedErrors = required(undefined as any);

    expect(nullErrors.length).toBeGreaterThan(0);
    expect(undefinedErrors.length).toBeGreaterThan(0);
  });
});

describe('requiredWithMessage', () => {
  it('returns defined error message', () => {
    const validationMessage = 'Missing text!';
    const errors = requiredWithMessage(validationMessage)('');

    expect(errors[0]).toBe(validationMessage);
  });
});
