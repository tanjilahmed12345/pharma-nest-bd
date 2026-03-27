type UserRecord = Record<string, any>;
export declare function sanitizeUser<T extends UserRecord>(user: T): Omit<T, 'passwordHash' | 'refreshTokenHash'>;
export {};
