import { Module } from '@nestjs/common';
import { CaslIngredientAbilityFactory } from './casl-ingredient-ability.factory';
import { CaslPhotoAbilityFactory } from './casl-photo-ability.factory';
import { CaslProductAbilityFactory } from './casl-product-ability.factory';
import { CaslProductIngredientAbilityFactory } from './casl-product-ingredient-ability.factory';

@Module({
  providers: [
    CaslIngredientAbilityFactory,
    CaslProductAbilityFactory,
    CaslProductIngredientAbilityFactory,
    CaslPhotoAbilityFactory,
  ],
  exports: [
    CaslIngredientAbilityFactory,
    CaslProductAbilityFactory,
    CaslProductIngredientAbilityFactory,
    CaslPhotoAbilityFactory,
  ],
})
export class CaslModule {}
