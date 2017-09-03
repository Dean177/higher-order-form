import { flatMap, isArray, mapValues, pickBy, some } from 'lodash'

export type ValueValidationResult = Array<string>

export type NestedValidationResult<T> =
  { [K in keyof T]?: ValueValidationResult | NestedValidationResult<T[K]> }

export type ValidationResult<T> =
  ValueValidationResult | NestedValidationResult<T>

export type ValueValidator<T> = (value: T) => ValueValidationResult
export type FlatValidator<T> = (value: T) => NestedValidationResult<T>

// TODO remove this type
export type FlatValidatorFn<T> = (value: T) => ValueValidationResult | NestedValidationResult<T>

export type NestedValidator<T> =
  { [K in keyof T]?: NestedValidator<T[K]> | FlatValidator<T[K]> | ValueValidator<T[K]> }

export type Validator<T> =
  ValueValidator<T> | FlatValidator<T> | NestedValidator<T>

export function validate<T>(validator: ValueValidator<T>, target: T): ValueValidationResult
export function validate<T>(validator: FlatValidator<T>, target: T): NestedValidationResult<T>
export function validate<T>(validator: NestedValidator<T>, target: T): NestedValidationResult<T>
export function validate<T>(validator: Validator<T>, target: T): ValidationResult<T> {
  if (typeof validator === 'function') {
    return validator(target)
  }

  const result = mapValues(validator, (subValidator: NestedValidator<T[keyof T]>, key: keyof T) =>
    validate(subValidator, target[key]))

  return pickBy(result, (errors) => isArray(errors) ? errors.length > 0 : errors != null)
}

export const hasValidationErrors = <T>(result: ValidationResult<T>): boolean =>
  some(result as object, (validationErrors: ValueValidationResult) =>
    isArray(validationErrors)
      ? validationErrors.length > 0
      : (validationErrors != null && hasValidationErrors(validationErrors)))
