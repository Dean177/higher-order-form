import { Validator } from '../../composable-validation/src/validate'

type HasLength = { length: number }

export const minLengthWith = (minimum: number): Validator<HasLength> => (val: HasLength) =>
  val.length < minimum ? [`length must be at least ${minimum}`] : []

export const maxLength = (maximum: number): Validator<HasLength> => (val: HasLength) =>
  val.length < maximum ? [`length must be at most ${maximum}`] : []