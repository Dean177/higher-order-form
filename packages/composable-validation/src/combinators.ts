import { ValueValidator } from './validate'

export const requiredWithMessage =
  (message: string): ValueValidator<any> => (value) => { // tslint:disable-line:no-any
    const isNotPresent = value == null ||
      (typeof value === 'string' && value.trim().length === 0) ||
      (value instanceof Array && value.length === 0)

    return isNotPresent ? [message] : []
  }

export const required: ValueValidator<any> = // tslint:disable-line:no-any
  requiredWithMessage('Please complete this field')
