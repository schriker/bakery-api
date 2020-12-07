import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { User } from 'src/users/entities/user.entity';
import { Action } from './types/casl.types';

type Subjects = typeof Ingredient | typeof User | Ingredient | User | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslIngredientAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    if (user.isSeller) {
      can(Action.Manage, Ingredient, { 'user.id': user.id });
    }

    return build();
  }
}
