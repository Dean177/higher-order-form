import {
  fileExtension,
  hasFileType,
  maxFileSizeInMegaBytes,
  maxMegaBytes,
} from './fileValidators'

describe('hasFileType', () => {
  it('looks at only the file name', () => {
    const errors = hasFileType('jpg', 'png')({ name: 'hello.gif' } as any as File)
    expect(errors.length).toBeGreaterThan(0)
  })

  it('will return no errors for null', () => {
    const errors = hasFileType('jpg')(null)
    expect(errors.length).toBe(0)
  })
})

describe('fileExtension', () => {
  const fileExtensions = ['png', 'JPEG', 'tiff']

  it('Accepts an empty file name. Use the `required` validator to ensure a file is selected', () => {
    const errors = fileExtension(...fileExtensions)('')
    expect(errors.length).toBe(0)
  })

  it('Will return a validation error when no matching file extension', () => {
    const errors = fileExtension(...fileExtensions)('invalid.pix')
    expect(errors.length).toBeGreaterThan(0)
  })

  it('returns an error when there is no `.` prior to the extension', () => {
    const errors = fileExtension(...fileExtensions)('invalidpng')
    expect(errors.length).toBeGreaterThan(0)
  })

  it('will return no errors when given a valid file name', () => {
    const errors = fileExtension(...fileExtensions)('valid.tiff')
    expect(errors).toEqual([])
  })

  it('converts all extensions to lower case when matching', () => {
    const upperCase = fileExtension(...fileExtensions)('valid.PNG')
    expect(upperCase.length).toBe(0)

    const lowerCase = fileExtension(...fileExtensions)('valid.jpeg')
    expect(lowerCase.length).toBe(0)
  })
})

describe('maxFileSizeInMegaBytes', () => {
  it('looks only at the file `size` property', () => {
    const errors = maxFileSizeInMegaBytes(50)({ size: 1000000 } as any as File)
    expect(errors.length).toBe(0)
  })

  it('Returns no errors for null files', () => {
    const errors = maxFileSizeInMegaBytes(50)(null)
    expect(errors.length).toBe(0)
  })
})

describe('maxMegaBytes', () => {
  const fiftyMegabytesInBytes = 50 * 1024 * 1024
  it('Returns no errors smaller file sizes', () => {
    const errors = maxMegaBytes(100)(fiftyMegabytesInBytes)
    expect(errors.length).toBe(0)
  })

  it('Returns no errors equal file sizes', () => {
    const errors = maxMegaBytes(50)(fiftyMegabytesInBytes)
    expect(errors.length).toBe(0)
  })

  it('Returns errors larger file sizes', () => {
    const errors = maxMegaBytes(10)(fiftyMegabytesInBytes)
    expect(errors.length).toBeGreaterThan(0)
  })
})
