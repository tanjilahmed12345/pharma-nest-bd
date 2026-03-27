"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeUser = sanitizeUser;
const SENSITIVE_FIELDS = ['passwordHash', 'refreshTokenHash'];
function sanitizeUser(user) {
    const sanitized = { ...user };
    for (const field of SENSITIVE_FIELDS) {
        delete sanitized[field];
    }
    return sanitized;
}
//# sourceMappingURL=user-response.util.js.map