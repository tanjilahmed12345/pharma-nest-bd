type UserRecord = Record<string, any>;

const SENSITIVE_FIELDS = ['passwordHash', 'refreshTokenHash'];

export function sanitizeUser<T extends UserRecord>(user: T): Omit<T, 'passwordHash' | 'refreshTokenHash'> {
  const sanitized = { ...user };
  for (const field of SENSITIVE_FIELDS) {
    delete sanitized[field];
  }
  return sanitized;
}
