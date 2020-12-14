import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { Upload } from 'src/products/dto/createProduct.args';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Photo } from './entities/photo.entity';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,
  ) {}

  createPathForFile(filename: string) {
    try {
      const uuid = uuidv4();
      const filePath = join(__dirname, '..', '..', 'uploads', 'photos', uuid);

      if (!existsSync(filePath)) {
        mkdirSync(filePath);
      }

      return `${filePath}/${filename}`;
    } catch (e) {
      throw new Error(e);
    }
  }

  async savePhotoFile(photo: Upload) {
    const acceptedImageTypes = ['image/jpeg', 'image/png'];
    const file = await photo;
    const stream = file.createReadStream();
    const filePath = this.createPathForFile(file.filename);

    if (!acceptedImageTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid image file type.');
    }

    return new Promise((resolve, reject) => {
      stream
        .on('error', (error) => {
          reject(error);
        })
        .pipe(createWriteStream(filePath))
        .on('error', reject)
        .on('finish', () => {
          resolve(filePath);
        });
    });
  }

  savePhoto(photos: Upload | Upload[]) {
    return new Promise<void>(async (resolve) => {
      if (Array.isArray(photos)) {
        for await (const photo of photos) {
          await this.savePhotoFile(photo);
        }
      } else {
        await this.savePhotoFile(photos);
      }
      resolve();
    });
  }
}
