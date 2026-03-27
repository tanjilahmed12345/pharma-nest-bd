import { BadRequestException } from '@nestjs/common';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateUploadedFile(file: Express.Multer.File): void {
  if (!file) {
    throw new BadRequestException('No file uploaded');
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new BadRequestException(
      `Invalid file type: ${file.mimetype}. Allowed: JPEG, PNG, WebP, PDF`,
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new BadRequestException(
      `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum: 5MB`,
    );
  }
}
