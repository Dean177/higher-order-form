import { ValueValidator, valid } from '../validate'

export const maxLength = (max: number): ValueValidator<string> =>
  (value: string) => value.length > max ? [`Must be less than ${max} characters`] : valid

export const minLength = (min: number): ValueValidator<string> =>
  (value: string) => value.length < min ? [`Must be at least ${min} characters`] : valid

export const trimmed = (validator: ValueValidator<string>): ValueValidator<string> =>
    (value: string) => validator(value.trim())

export const validEmail: ValueValidator<string> = (email: string) => {
  const parts = email.split('@')
  const [before, after] = parts
  const isValidEmail = (email.length > 0) &&
    parts.length === 2 &&
    before.length > 0 &&
    after.length > 0

  return isValidEmail ? valid : ['Please enter a valid email']
}
