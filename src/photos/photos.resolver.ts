import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { GQLSessionGuard } from 'src/auth/guards/gql-session-auth.guard';
import { Action } from 'src/casl/types/casl.types';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { Photo } from './entities/photo.entity';
import { PhotosService } from './photos.service';

@Resolver(() => Photo)
export class PhotosResolver {
  constructor(private photosService: PhotosService) {}

  @Mutation(() => Boolean)
  @UseGuards(GQLSessionGuard)
  async deletePhoto(
    @CurrentUser() user: User,
    @Args('id', { type: () => [Int] }) id: number[],
  ) {
    const photos = await this.photosService.findPhotosById(id);
    this.photosService.checkAbility(Action.Manage, user, photos);
    this.photosService.removePhotoFiles(photos);
    this.photosService.deletePhotosById(id);
    return true;
  }
}
