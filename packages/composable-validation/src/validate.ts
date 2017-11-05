import { isArray, mapValues, pickBy, some } from 'lodash'

type TODO = any // TODO remove tslint:disable-line:no-any

export type ValueValidator<T> = (value: T) => ValueValidationResult
export type ValueValidationResult = Array<string>

export const valid: ValueValidationResult = []

export type FlatValidator<T> = { [K in keyof T]?: ValueValidator<T[K]> }
export type FlatValidationResult<T> = { [K in keyof T]?: ValueValidationResult }

export type NestedValidator<T> = {
  [K in keyof T]?: NestedValidator<T[K]> | FlatValidator<T[K]> | ValueValidator<T[K]>
}
export type NestedValidationResult<T> =
  { [K in keyof T]?: ValueValidationResult | NestedValidationResult<T[K]> }

export type Validator<T> =
  ValueValidator<T> | FlatValidator<T> | NestedValidator<T>
export type ValidationResult<T> =
  ValueValidationResult | FlatValidationResult<T> | NestedValidationResult<T>

export function validate<T>(validator: ValueValidator<T>, target: T): ValueValidationResult
export function validate<T>(validator: FlatValidator<T>, target: T): FlatValidationResult<T>
export function validate<T>(validator: NestedValidator<T>, target: T): NestedValidationResult<T>
export function validate<T>(validator: Validator<T>, target: T): ValidationResult<T> {
  if (typeof validator === 'function') {
    return validator(target)
  }
  const refinedValidator: FlatValidator<T> | NestedValidator<T> = validator
  const result: FlatValidationResult<T> | NestedValidationResult<T> = mapValues(
    refinedValidator,
    <K extends keyof T>(subValidator: Validator<T[K]>, key: K): ValidationResult<T[K]> =>
      validate<T[K]>(subValidator as TODO, target[key] as T[K]),
  ) as TODO

  return pickBy(result, (errors): boolean => isArray(errors) ? (errors.length > 0) : (errors != null)) as TODO
}

export const hasValidationErrors = <T>(result: ValidationResult<T>): boolean =>
  some(result as object, (validationErrors: ValueValidationResult) =>
    isArray(validationErrors)
      ? validationErrors.length > 0
      : (validationErrors != null && hasValidationErrors(validationErrors)))
