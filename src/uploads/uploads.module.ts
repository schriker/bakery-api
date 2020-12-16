import { Module } from '@nestjs/common';
import { PhotosModule } from 'src/photos/photos.module';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  controllers: [UploadsController],
  imports: [PhotosModule],
  providers: [UploadsService],
})
export class UploadsModule {}
