import { ValueValidator } from './validate';

const onlyIf =
  <T>(condition: boolean | (() => boolean), validator: ValueValidator<T>): ValueValidator<T> => (value) => {
    const returnValidationErrors = typeof condition === 'function' ? condition() : condition;
    return returnValidationErrors ? validator(value) : [];
  };

export default onlyIf;
