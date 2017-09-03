import { flatMap } from 'lodash';
import { FlatValidator, FlatValidatorFn, validate, Validator, ValueValidator } from './validate'

// TODO remove the casts
export const requiredWithMessage = (message: string) =>
  <T>(validator: Validator<T>): FlatValidatorFn<T | null | undefined> => (val: T | null | undefined) => {
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
