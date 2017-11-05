import { ValueValidator } from '../validate'

type WithLength = { length: number }

export const maxLength = (max: number): ValueValidator<WithLength> =>
  (value: WithLength) => value.length > max ? [`Must be less than ${max} characters`] : []

export const minLength = (min: number): ValueValidator<string> =>
  (value: WithLength) => value.length < min ? [`Must be at least ${min} characters`] : []

export const validEmail: ValueValidator<string> = (email: string) => {
  const parts = email.split('@')
  const [before, after] = parts
  const isValidEmail = (email.length > 0) &&
    parts.length === 2 &&
    before.length > 0 &&
    after.length > 0

  return isValidEmail ? [] : ['Please enter a valid email']
}
