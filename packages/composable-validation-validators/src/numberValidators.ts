import { ValueValidator } from '../validate'

export const maxValue = (max: number): ValueValidator<number> =>
  (value: number) => value > max ? [`Value must be less than or equal to  ${max}`] : []

export const minValue = (min: number): ValueValidator<number> =>
  (value: number) => value < min ? [`Value must be greater than or equal to  ${min}`] : []
