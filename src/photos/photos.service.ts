import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { Upload } from 'src/products/dto/createProduct.args';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Photo } from './entities/photo.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,
    @InjectQueue('photo')
    private photoQueue: Queue,
  ) {}

  createPathForFile() {
    try {
      const uuid = uuidv4();
      const filePath = join(__dirname, '..', '..', 'uploads', 'photos', uuid);

      if (!existsSync(filePath)) {
        mkdirSync(filePath);
      }

      return filePath;
    } catch (e) {
      throw new Error(e);
    }
  }

  private async savePhotoFile(photo: Upload) {
    const acceptedImageTypes = ['image/jpeg', 'image/png'];
    const file = await photo;
    const stream = file.createReadStream();
    const filePath = this.createPathForFile();

    if (!acceptedImageTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid image file type.');
    }

    return new Promise<Photo>((resolve, reject) => {
      stream
        .on('error', (error) => {
          reject(error);
        })
        .pipe(createWriteStream(`${filePath}/${file.filename}`))
        .on('error', reject)
        .on('finish', async () => {
          const photo = new Photo();
          photo.name = file.filename;
          photo.url = filePath;
          await this.photoQueue.add(
            {
              path: filePath,
              name: file.filename,
            },
            {
              removeOnComplete: true,
            },
          );
          resolve(photo);
        });
    });
  }

  savePhotos(photos: Photo[]) {
    return this.photosRepository.save(photos);
  }

  createPhoto(photos: Upload | Upload[]) {
    return new Promise<Photo[]>(async (resolve) => {
      const photosEntities: Photo[] = [];

      if (Array.isArray(photos)) {
        for await (const photo of photos) {
          const result = await this.savePhotoFile(photo);
          photosEntities.push(result);
        }
      } else {
        const result = await this.savePhotoFile(photos);
        photosEntities.push(result);
      }
      resolve(photosEntities);
    });
  }
}
