import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SessionGuard } from 'src/auth/guards/session-auth.guard';
import { PhotosService } from 'src/photos/photos.service';
import { CurrentSessionUser } from 'src/users/decorators/currentUser.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller()
export class UploadsController {
  constructor(private photosService: PhotosService) {}

  @Post('upload')
  @UseGuards(SessionGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5000000,
      },
    }),
  )
  async uploadPhotoFile(
    @UploadedFile() file,
    @CurrentSessionUser() user: User,
  ) {
    const { id, name, url } = await this.photosService.savePhoto(file, user);
    return {
      id,
      name,
      url,
    };
  }
}
