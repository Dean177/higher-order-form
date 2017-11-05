import { ValueValidator } from '../validate'

export const maxLength = <T>(max: number): ValueValidator<Array<T>> =>
  (value: Array<T>) => value.length > max ? [`Must be at most ${max}`] : []

export const minLength = <T>(min: number): ValueValidator<Array<T>> =>
  (value: Array<T>) => value.length < min ? [`Must be at least ${min}`] : []
