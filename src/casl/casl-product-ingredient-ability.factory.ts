import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { ProductIngredient } from 'src/product-ingredients/entities/product-ingredient.entity';
import { User } from 'src/users/entities/user.entity';
import { Action } from './types/casl.types';

type Subjects =
  | typeof ProductIngredient
  | typeof User
  | ProductIngredient
  | User
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslProductIngredientAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    if (user.isSeller) {
      can(Action.Manage, ProductIngredient, { 'user.id': user.id });
    }

    return build();
  }
}
