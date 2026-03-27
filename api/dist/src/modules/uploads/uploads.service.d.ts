import type { FileStorageService, FileMetadata } from './storage/file-storage.interface';
export declare class UploadsService {
    private storage;
    constructor(storage: FileStorageService);
    uploadPrescription(file: Express.Multer.File): Promise<FileMetadata>;
    uploadPaymentProof(file: Express.Multer.File): Promise<FileMetadata>;
}
