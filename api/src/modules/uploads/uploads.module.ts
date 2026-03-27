import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { LocalFileStorageService } from './storage/local-file-storage.service';
import { FILE_STORAGE_SERVICE } from './storage/file-storage.interface';

@Module({
  controllers: [UploadsController],
  providers: [
    UploadsService,
    {
      provide: FILE_STORAGE_SERVICE,
      useClass: LocalFileStorageService,
    },
  ],
  exports: [UploadsService],
})
export class UploadsModule {}
