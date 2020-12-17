import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Action } from './types/casl.types';

type Subjects = typeof Product | typeof User | Product | User | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslProductAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    if (user.isSeller && user.isVerified) {
      can(Action.Manage, Product, { 'user.id': user.id });
    }

    return build();
  }
}
