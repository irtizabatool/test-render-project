// Class Validation messages

export const INVALID_EMAIL = 'Email should be a valid email-Id!';

export const EMPTY_FIELD = 'field should not be empty!';

export const STRING_VALUE = 'field should be a string value!';

export const PASSWORD_REGEX =
  /^(?:(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)$/;

export const MATCH_PASSWORD =
  'Password should be atleast 8 characters and should contain combination of uppercase, lowercase & numbers!';

export const PASSWORD_LENGTH =
  'Passwords should not be less than 8 characters!';
