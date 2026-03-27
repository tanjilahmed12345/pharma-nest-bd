import { Inject, Injectable } from '@nestjs/common';
import {
  FILE_STORAGE_SERVICE,
} from './storage/file-storage.interface';
import type { FileStorageService, FileMetadata } from './storage/file-storage.interface';
import { validateUploadedFile } from '../../common/utils/file-upload.util';

@Injectable()
export class UploadsService {
  constructor(
    @Inject(FILE_STORAGE_SERVICE)
    private storage: FileStorageService,
  ) {}

  async uploadPrescription(file: Express.Multer.File): Promise<FileMetadata> {
    validateUploadedFile(file);
    return this.storage.save(file, 'prescriptions');
  }

  async uploadPaymentProof(file: Express.Multer.File): Promise<FileMetadata> {
    validateUploadedFile(file);
    return this.storage.save(file, 'payments');
  }
}
