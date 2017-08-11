import { chain, flatMap, mapValues, pickBy, some } from 'lodash';

export type ValidationErrors = Array<string>;
export type ValueValidator<T> = (value: T) => ValidationErrors;

export type Validator<T> = {
  [P in keyof T]?: ValueValidator<T[P]>
};

export type ValidationResult<T> = {
  [P in keyof T]?: ValidationErrors
};

export const rules = <T>(...validators: Array<ValueValidator<T>>): ValueValidator<T> =>
  (value) => flatMap(validators, (validator) => validator(value));

export const validateKey =
  <T, K extends keyof T>(objectValidator: Validator<T>, key: K, value: T[K]): ValidationErrors => {
    const validator: ValueValidator<T[K]> | undefined = objectValidator[key];
    return validator != null ? validator(value) : [];
  };

export const validate = <T>(objectValidator: Validator<T>, object: T): ValidationResult<T> =>
  pickBy(
    mapValues(
      objectValidator,
      <K extends keyof T>(validateValue: ValueValidator<T[K]>, key: K) =>
        validateValue(object[key]),
    ) as ValidationResult<T>,
    (errors) => errors && errors.length > 0,
  );

export const hasValidationErrors = <T>(result: ValidationResult<T>): boolean =>
  some(result as object, (validationErrors: ValidationErrors) => (validationErrors && validationErrors.length > 0));
