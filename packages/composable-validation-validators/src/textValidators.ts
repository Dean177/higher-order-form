import { Validator } from 'composable-validation'

type WithLength = { length: number }

export const maxLength = (max: number): Validator<WithLength> =>
  (value: WithLength) => value.length > max ? [`Must be less than ${max} characters`] : []

export const minLength = (min: number): Validator<string> =>
  (value: WithLength) => value.length < min ? [`Must be at least ${min} characters`] : []

export const validEmail: Validator<string> = (email: string) => {
  const parts = email.split('@')
  const [before, after] = parts
  const isValidEmail = (email.length > 0) &&
    parts.length === 2 &&
    before.length > 0 &&
    after.length > 0

  return isValidEmail ? [] : ['Please enter a valid email']
}
