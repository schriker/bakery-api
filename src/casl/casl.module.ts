import { Module } from '@nestjs/common';
import { CaslIngredientAbilityFactory } from './casl-ingredient-ability.factory';
import { CaslProductAbilityFactory } from './casl-product-ability.factory copy';

@Module({
  providers: [CaslIngredientAbilityFactory, CaslProductAbilityFactory],
  exports: [CaslIngredientAbilityFactory, CaslProductAbilityFactory],
})
export class CaslModule {}
