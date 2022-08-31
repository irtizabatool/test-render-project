// Class Validation messages

export const INVALID_EMAIL = 'Email should be a valid email-Id!';

export const EMPTY_FIELD = 'field should not be empty!';

export const STRING_VALUE = 'field should be a string value!';

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^=><`()~])[A-Za-z\d@$!%*?&#^=><`()~]{8,}$/;
   
export const MATCH_PASSWORD = 'Password should be at least 8 characters and should contain at least 1 uppercase, 1 lowercase, 1 special character & 1 digit!';

export const PASSWORD_LENGTH = 'Password should not be less than 8 characters!';