import { Module } from '@nestjs/common';
import { CaslIngredientAbilityFactory } from './casl-ingredient-ability.factory';
import { CaslProductAbilityFactory } from './casl-product-ability.factory';
import { CaslProductIngredientAbilityFactory } from './casl-product-ingredient-ability.factory';

@Module({
  providers: [
    CaslIngredientAbilityFactory,
    CaslProductAbilityFactory,
    CaslProductIngredientAbilityFactory,
  ],
  exports: [
    CaslIngredientAbilityFactory,
    CaslProductAbilityFactory,
    CaslProductIngredientAbilityFactory,
  ],
})
export class CaslModule {}
