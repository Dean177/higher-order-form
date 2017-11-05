import { flatMap } from 'lodash';
import { valid, ValueValidator } from './validate'

export function onlyIf<T>(condition: boolean | ((val: T) => boolean), validator: ValueValidator<T>): ValueValidator<T> {
  return ((value: T) => {
    const shouldReturnValidationErrors = typeof condition === 'function' ? condition(value) : condition
    return shouldReturnValidationErrors
      ? validator(value)
      : valid
  })
}

export const requiredWithMessage = (message: string) =>
  <T>(validator: ValueValidator<T> | undefined): ValueValidator<T | null | undefined> =>
    (val: T | null | undefined) => {
      if ((val == null) || (typeof val === 'string' && val.length === 0)) {
        return [message]
      }

      return validator ? validator(val) : valid
    }

export const required: <T>(validator: ValueValidator<T> | undefined) => ValueValidator<T | null | undefined> =
  requiredWithMessage('Please complete this field')


export const optional = <T>(validator: ValueValidator<T>): ValueValidator<T | null | undefined> =>
  (val: T | null | undefined) => {
    if (val == null) {
      return []
    }

    return validator(val)
  }

export const rules = <T>(...validators: Array<ValueValidator<T>>): ValueValidator<T> =>
  (value) => flatMap(validators, (validator) => validator(value))
