import { InjectQueue } from '@nestjs/bull';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  rmdir,
  unlinkSync,
} from 'fs';
import { join } from 'path';
import { Upload } from 'src/products/dto/createProduct.args';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Photo } from './entities/photo.entity';

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

      return { filePath, url: `/photos/${uuid}` };
    } catch (e) {
      throw new Error(e);
    }
  }

  private async savePhotoFile(photo: Upload) {
    try {
      const acceptedImageTypes = ['image/jpeg', 'image/png'];
      const file = await photo;
      const stream = file.createReadStream();
      const photoFile = this.createPathForFile();

      if (!acceptedImageTypes.includes(file.mimetype)) {
        throw new BadRequestException('Invalid image file type.');
      }

      return new Promise<Photo>((resolve, reject) => {
        const writeStream = createWriteStream(
          `${photoFile.filePath}/${file.filename}`,
        );
        writeStream.on('finish', async () => {
          try {
            const photo = new Photo();
            photo.name = file.filename;
            photo.url = `${photoFile.url}/${file.filename}`;
            await this.photoQueue.add({
              path: photoFile.filePath,
              name: file.filename,
            });
            this.photoQueue.clean(5000);
            resolve(photo);
          } catch (e) {
            console.log(e);
          }
        });

        writeStream.on('error', (error) => {
          unlinkSync(`${photoFile.filePath}/${file.filename}`);
          rmdir(photoFile.filePath, () => {
            reject(error);
          });
        });

        stream.on('error', (error) => {
          reject(error);
          writeStream.destroy(error);
        });
        stream.pipe(writeStream);
      });
    } catch (e) {
      console.log(e);
    }
  }

  savePhotos(photos: Photo[]) {
    return this.photosRepository.save(photos);
  }

  createPhoto(photos: Upload | Upload[]) {
    return new Promise<Photo[]>(async (resolve, reject) => {
      try {
        const photosEntities: Photo[] = [];

        if (Array.isArray(photos)) {
          if (photos.length > 5) {
            throw new Error('Max number of photos 5');
          }
          for await (const photo of photos) {
            const result = await this.savePhotoFile(photo);
            photosEntities.push(result);
          }
        } else {
          const result = await this.savePhotoFile(photos);
          photosEntities.push(result);
        }
        resolve(photosEntities);
      } catch (e) {
        reject(e);
      }
    });
  }
}
