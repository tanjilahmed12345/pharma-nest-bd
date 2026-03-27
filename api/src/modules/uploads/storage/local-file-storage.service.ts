import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import type { FileStorageService, FileMetadata } from './file-storage.interface';

@Injectable()
export class LocalFileStorageService implements FileStorageService {
  private readonly uploadDir: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('upload.dir') || './uploads';
  }

  async save(
    file: Express.Multer.File,
    subfolder: string,
  ): Promise<FileMetadata> {
    const dir = path.join(this.uploadDir, subfolder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const fileName = `${randomUUID()}${ext}`;
    const filePath = path.join(dir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const url = `/uploads/${subfolder}/${fileName}`;

    return {
      fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: filePath,
      url,
    };
  }

  async delete(filePath: string): Promise<void> {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
