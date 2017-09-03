import { flatMap, mapValues, pickBy, some } from 'lodash'

export type ValidationErrors = Array<string>;

export type ValidationResult<T> = ValidationErrors | {
  [P in keyof T]?: ValidationErrors | ValidationResult<T[P]>
};

export type ValueValidator<T> = (value: T) => ValidationErrors;

export type ObjectValidator<T> = {
  [P in keyof T]?: ObjectValidator<T[P]> | ValueValidator<T[P]>
};

export type Validator<T> = ObjectValidator<T> | ValueValidator<T>;


export const validate = <T>(validator: Validator<T>, target: T): ValidationResult<T> => {
  if (typeof validator === 'function') {
    return validator(target);
  }

  return mapValues(validator, (validateValue: ValueValidator<T[keyof T]>, key: keyof T) =>
    validate(validateValue, target[key])) as ValidationResult<T>;
};

export const rules = <T>(...validators: Array<ValueValidator<T>>): ValueValidator<T> =>
  (value) => flatMap(validators, (validator) => validator(value))

export const validate = <T>(objectValidator: Validator<T>, object: T): ValidationResult<T> =>
  pickBy(
    mapValues(
      objectValidator,
      <K extends keyof T>(validateValue: ValueValidator<T[K]>, key: K) =>
        validateValue(object[key]),
    ) as ValidationResult<T>,
    (errors) => errors && errors.length > 0,
  )

  (value) => flatMap(validators, (validator) => validator(value));

export const hasValidationErrors = <T>(result: ValidationResult<T>): boolean =>
  some(result as object, (validationErrors: ValidationErrors) =>
    (validationErrors && validationErrors.length > 0));
  some(result as object, (validationErrors: ValidationErrors) => (validationErrors && validationErrors.length > 0))

export const required = <T>(...validators: Array<ValueValidator<T>>): ValueValidator<T | null | undefined> =>
  (val: T | null | undefined) => {
    if ((val == null) || (typeof val === 'string' && val.length === 0)) {
      return ['Required']
    }

    return rules(...validators)(val)
  }

export const optional = <T>(...validators: Array<ValueValidator<T>>): ValueValidator<T | null | undefined> =>
  (val: T | null | undefined) => {
    if (val == null) {
      return []
    }

    return rules(...validators)(val)
  }