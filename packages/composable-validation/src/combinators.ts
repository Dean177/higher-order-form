import { flatMap } from 'lodash';
import { FlatValidator, FlatValidatorFn, identityValidator, validate, Validator, ValueValidator } from './validate'

// TODO remove the casts, the FlatValidatorFn type
export const onlyIf =
  <T>(condition: boolean | ((val: T) => boolean), validator: Validator<T>): FlatValidatorFn<T> => (value: T) => {
    const returnValidationErrors = typeof condition === 'function' ? condition(value) : condition
    return returnValidationErrors ? validate(validator as FlatValidator<T>, value) : []
  }

// TODO remove the casts, the FlatValidatorFn type
export const requiredWithMessage = (message: string) =>
  <T>(validator: Validator<T> = identityValidator): FlatValidatorFn<T | null | undefined> => (val: T | null | undefined) => {
    if ((val == null) || (typeof val === 'string' && val.length === 0)) {
      return [message]
    }

    return validate(validator as FlatValidator<T>, val)
  }

export const required: Validator<any> = // tslint:disable-line:no-any
  requiredWithMessage('Please complete this field')

export const optional = <T>(validator: Validator<T>): FlatValidatorFn<T | null | undefined> =>
  (val: T | null | undefined) => {
    if (val == null) {
      return []
    }

    return validate(validator as FlatValidator<T>, val)
  }

export const rules = <T>(...validators: Array<ValueValidator<T>>): ValueValidator<T> =>
  (value) => flatMap(validators, (validator) => validator(value))
