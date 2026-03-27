import { ConfigService } from '@nestjs/config';
import type { FileStorageService, FileMetadata } from './file-storage.interface';
export declare class LocalFileStorageService implements FileStorageService {
    private configService;
    private readonly uploadDir;
    constructor(configService: ConfigService);
    save(file: Express.Multer.File, subfolder: string): Promise<FileMetadata>;
    delete(filePath: string): Promise<void>;
}
