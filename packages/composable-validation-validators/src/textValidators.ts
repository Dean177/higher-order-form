import { ValueValidator } from 'composable-validation';

export const maxLength = (max: number): ValueValidator<string | null> =>
  (value: string | null) => (value != null && value.length > max) ? [`Text must be less than ${max} characters`] : [];

export const minLength = (min: number): ValueValidator<string> =>
  (value: string) => value.length < min ? [`Must be at least ${min} characters`] : [];
