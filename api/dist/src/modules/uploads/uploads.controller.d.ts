import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private uploadsService;
    constructor(uploadsService: UploadsService);
    uploadPrescription(file: Express.Multer.File): Promise<import("./storage/file-storage.interface").FileMetadata>;
    uploadPaymentProof(file: Express.Multer.File): Promise<import("./storage/file-storage.interface").FileMetadata>;
}
