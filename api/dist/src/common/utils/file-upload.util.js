"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUploadedFile = validateUploadedFile;
const common_1 = require("@nestjs/common");
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
function validateUploadedFile(file) {
    if (!file) {
        throw new common_1.BadRequestException('No file uploaded');
    }
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        throw new common_1.BadRequestException(`Invalid file type: ${file.mimetype}. Allowed: JPEG, PNG, WebP, PDF`);
    }
    if (file.size > MAX_FILE_SIZE) {
        throw new common_1.BadRequestException(`File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum: 5MB`);
    }
}
//# sourceMappingURL=file-upload.util.js.map