import { endsWith, map, some, toLower } from 'lodash'
import { ValueValidator } from '../validate'

export type MegaBytes = number
export type Bytes = number

export const maxFileSizeInMegaBytes = (maxMb: MegaBytes): ValueValidator<File | null> => (file: File | null) =>
  (file == null) ? [] : maxMegaBytes(maxMb)(file.size)

export const maxMegaBytes = (maxMb: MegaBytes): ValueValidator<Bytes> => (fileSize: Bytes) =>
  fileSize > (maxMb * 1024 * 1024) ? [`Please select a file less than ${maxMb}MB`] : []

export const hasFileType = (...endings: Array<string>): ValueValidator<File | null> => (file: File | null) =>
  fileExtension(...endings)(file && file.name || '')

export const fileExtension = (...endings: Array<string>): ValueValidator<string> => (fileName: string) => {
  if (fileName === '') {
    return []
  }

  const lowercaseEndings = map(endings, toLower)
  const hasEnding = some(lowercaseEndings, (ending) => endsWith(toLower(fileName), `.${ending}`))

  return !hasEnding ? [`Please choose a file of one of the following types: ${endings.join(', ')}`] : []
}
