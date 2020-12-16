import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import {
  existsSync,
  mkdirSync,
  rmdir,
  rmdirSync,
  unlinkSync,
  writeFile,
} from 'fs';
import { join } from 'path';
import { CaslPhotoAbilityFactory } from 'src/casl/casl-photo-ability.factory';
import { Action } from 'src/casl/types/casl.types';
import { Upload } from 'src/products/dto/createProduct.args';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Photo } from './entities/photo.entity';

type FilePathType = {
  filePath: string;
  url: string;
};

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,
    @InjectQueue('photo')
    private photoQueue: Queue,
    private caslPhotoAbilityFactory: CaslPhotoAbilityFactory,
  ) {}

  private checkAbility(
    action: Action,
    user: User,
    photo: Photo | Photo[] | typeof Photo,
  ) {
    const ability = this.caslPhotoAbilityFactory.createForUser(user);

    if (Array.isArray(photo)) {
      photo.forEach((photo) => {
        if (!ability.can(Action.Manage, photo)) {
          throw new ForbiddenException();
        }
      });
    } else {
      if (!ability.can(action, photo)) {
        throw new ForbiddenException();
      }
    }
  }

  private createPathForFile() {
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

  private async savePhotoFile(photoFile: Upload) {
    try {
      const acceptedImageTypes = ['image/jpeg', 'image/png'];

      if (!acceptedImageTypes.includes(photoFile.mimetype)) {
        throw new BadRequestException('Invalid image file type.');
      }

      const photoPath = this.createPathForFile();

      return new Promise<FilePathType>((resolve, reject) => {
        writeFile(
          `${photoPath.filePath}/${photoFile.originalname}`,
          photoFile.buffer,
          async (error) => {
            if (error) {
              unlinkSync(`${photoPath.filePath}/${photoFile.originalname}`);
              rmdir(photoPath.filePath, () => {
                reject(error);
              });
            }
            await this.photoQueue.add({
              path: photoPath.filePath,
              name: photoFile.originalname,
            });
            this.photoQueue.clean(5000);
            resolve(photoPath);
          },
        );
      });
    } catch (e) {
      console.log(e);
    }
  }

  removePhotoFiles(photos: Photo[]) {
    photos.forEach((photo) => {
      const thumbnail = join(
        __dirname,
        '..',
        '..',
        'uploads',
        `${photo.url}/full_${photo.name}`,
      );
      const full = join(
        __dirname,
        '..',
        '..',
        'uploads',
        `${photo.url}/thumbnail_${photo.name}`,
      );
      const folder = join(__dirname, '..', '..', 'uploads', photo.url);

      if (existsSync(thumbnail)) {
        unlinkSync(thumbnail);
      }

      if (existsSync(full)) {
        unlinkSync(full);
      }

      if (existsSync(folder)) {
        rmdirSync(folder);
      }
    });
  }

  async savePhoto(photoFile: Upload, user: User) {
    this.checkAbility(Action.Manage, user, Photo);
    const photoFileData = await this.savePhotoFile(photoFile);
    const photoData = new Photo();
    photoData.name = photoFile.originalname;
    photoData.url = photoFileData.url;
    photoData.user = user;
    return this.photosRepository.save(photoData);
  }

  async updatePhotoProduct(photosIds: number[], user: User, product: Product) {
    const photos = await this.photosRepository.findByIds(photosIds, {
      relations: ['user'],
    });
    this.checkAbility(Action.Manage, user, photos);
    photos.forEach((photo) => {
      photo.product = product;
    });
    return this.photosRepository.save(photos);
  }
}
