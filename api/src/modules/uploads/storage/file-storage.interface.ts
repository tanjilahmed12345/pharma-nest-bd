export interface FileMetadata {
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
}

export interface FileStorageService {
  save(
    file: Express.Multer.File,
    subfolder: string,
  ): Promise<FileMetadata>;

  delete(filePath: string): Promise<void>;
}

export const FILE_STORAGE_SERVICE = 'FILE_STORAGE_SERVICE';
