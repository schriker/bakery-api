import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { PhotoConsumer } from './photos.processor';
import { PhotosService } from './photos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo]),
    BullModule.registerQueue({
      name: 'photo',
    }),
  ],
  exports: [PhotosService],
  providers: [PhotosService, PhotoConsumer],
})
export class PhotosModule {}
