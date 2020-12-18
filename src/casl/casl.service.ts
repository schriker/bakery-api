import { ForbiddenException, Injectable } from '@nestjs/common';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Conversation } from 'src/messages/entities/conversation.entity';
import { Photo } from 'src/photos/entities/photo.entity';
import { ProductIngredient } from 'src/product-ingredients/entities/product-ingredient.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { CaslConversationAbilityFactory } from './casl-conversation-ability.factory';
import { CaslIngredientAbilityFactory } from './casl-ingredient-ability.factory';
import { CaslPhotoAbilityFactory } from './casl-photo-ability.factory';
import { CaslProductAbilityFactory } from './casl-product-ability.factory';
import { CaslProductIngredientAbilityFactory } from './casl-product-ingredient-ability.factory';
import { Action } from './types/casl.types';

@Injectable()
export class CaslService {
  constructor(
    private caslProductAbilityFactory: CaslProductAbilityFactory,
    private caslPhotoAbilityFactory: CaslPhotoAbilityFactory,
    private caslIngredientAbilityFactory: CaslIngredientAbilityFactory,
    private caslConversationAbilityFactory: CaslConversationAbilityFactory,
    private caslProductIngredientAbilityFactory: CaslProductIngredientAbilityFactory,
  ) {}

  checkAbilityForProduct(
    action: Action,
    user: User,
    product: Product | Product[] | typeof Product,
  ) {
    const ability = this.caslProductAbilityFactory.createForUser(user);

    if (Array.isArray(product)) {
      product.forEach((product) => {
        if (!ability.can(action, product)) {
          throw new ForbiddenException();
        }
      });
    } else {
      if (!ability.can(action, product)) {
        throw new ForbiddenException();
      }
    }
  }

  checkAbilityForPhoto(
    action: Action,
    user: User,
    photo: Photo | Photo[] | typeof Photo,
  ) {
    const ability = this.caslPhotoAbilityFactory.createForUser(user);

    if (Array.isArray(photo)) {
      photo.forEach((photo) => {
        if (!ability.can(action, photo)) {
          throw new ForbiddenException();
        }
      });
    } else {
      if (!ability.can(action, photo)) {
        throw new ForbiddenException();
      }
    }
  }

  checkAbilityForIngredient(
    action: Action,
    user: User,
    ingredient: Ingredient | Ingredient[] | typeof Ingredient,
  ) {
    const ability = this.caslIngredientAbilityFactory.createForUser(user);

    if (Array.isArray(ingredient)) {
      ingredient.forEach((ingredient) => {
        if (!ability.can(action, ingredient)) {
          throw new ForbiddenException();
        }
      });
    } else {
      if (!ability.can(action, ingredient)) {
        throw new ForbiddenException();
      }
    }
  }

  checkAbilityForConversation(
    action: Action,
    user: User,
    conversation: Conversation | Conversation[] | typeof Conversation,
    participants?: User[],
  ) {
    const ability = this.caslConversationAbilityFactory.createForUser(
      user,
      participants,
    );
    if (Array.isArray(conversation)) {
      conversation.forEach((conversation) => {
        if (!ability.can(action, conversation)) {
          throw new ForbiddenException();
        }
      });
    } else {
      if (!ability.can(action, conversation)) {
        throw new ForbiddenException();
      }
    }
  }

  checkAbilityForProuctIngredient(
    action: Action,
    user: User,
    product: Product | typeof Product,
    ingredient: Ingredient | typeof Ingredient,
    productIngredient:
      | ProductIngredient
      | ProductIngredient[]
      | typeof ProductIngredient,
  ) {
    const productAbility = this.caslProductAbilityFactory.createForUser(user);
    const ingredientAbility = this.caslIngredientAbilityFactory.createForUser(
      user,
    );
    const productIngredientAbility = this.caslProductIngredientAbilityFactory.createForUser(
      user,
    );

    if (Array.isArray(productIngredient)) {
      productIngredient.forEach((productIngredient) => {
        if (!productIngredientAbility.can(action, productIngredient)) {
          throw new ForbiddenException();
        }
      });
    } else {
      if (!productIngredientAbility.can(action, productIngredient)) {
        throw new ForbiddenException();
      }
    }

    if (
      !productAbility.can(action, product) ||
      !ingredientAbility.can(action, ingredient)
    ) {
      throw new ForbiddenException();
    }
  }
}
