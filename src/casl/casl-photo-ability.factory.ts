import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Photo } from 'src/photos/entities/photo.entity';
import { User } from 'src/users/entities/user.entity';
import { Action } from './types/casl.types';

type Subjects = typeof Photo | typeof User | Photo | User | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslPhotoAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    if (user.isSeller && user.isVerified) {
      can(Action.Manage, Photo, { 'user.id': user.id });
    }

    return build();
  }
}
