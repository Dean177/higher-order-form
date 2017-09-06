import { ValueValidator } from 'composable-validation'

type WithLength = { length: number }

export const maxLength = (max: number): ValueValidator<WithLength> =>
  (value: WithLength) => value.length > max ? [`Must be less than ${max} characters`] : []

export const minLength = (min: number): ValueValidator<string> =>
  (value: WithLength) => value.length < min ? [`Must be at least ${min} characters`] : []
