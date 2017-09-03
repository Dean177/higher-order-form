import { flatMap, mapValues, some } from 'lodash'

export type ValidationErrors = Array<string>
export type ValueValidator<T> = (value: T) => ValidationErrors

export type Validator<T> = {
  [P in keyof T]?: ValueValidator<T[P]>
}

export type ValidationResult<T> = {
  [P in keyof T]?: ValidationErrors
}

export const rules = <T>(...validators: Array<ValueValidator<T>>): ValueValidator<T> =>
  (value) => flatMap(validators, (validator) => validator(value))

export const validate = <T>(objectValidator: Validator<T>, object: T): ValidationResult<T> =>
  mapValues(objectValidator, <K extends keyof T>(validateValue: ValueValidator<T[K]>, key: K) =>
    validateValue(object[key])) as ValidationResult<T>

export const hasValidationErrors = <T>(result: ValidationResult<T>): boolean =>
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