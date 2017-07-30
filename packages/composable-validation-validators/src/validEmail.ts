import { ValueValidator } from '../validate';

const validEmail: ValueValidator<string> = (email: string) => {
  const parts = email.split('@');
  const [before, after] = parts;
  const isValidEmail = (email.length > 0) &&
    parts.length === 2 &&
    before.length > 0 &&
    after.length > 0;

  return isValidEmail ? [] : ['Please enter a valid email'];
};

export default validEmail;
