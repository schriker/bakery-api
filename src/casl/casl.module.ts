import { Module } from '@nestjs/common';
import { CaslIngredientAbilityFactory } from './casl-ingredient-ability.factory';
import { CaslPhotoAbilityFactory } from './casl-photo-ability.factory';
import { CaslProductAbilityFactory } from './casl-product-ability.factory';
import { CaslProductIngredientAbilityFactory } from './casl-product-ingredient-ability.factory';
import { CaslService } from './casl.service';

@Module({
  providers: [
    CaslIngredientAbilityFactory,
    CaslProductAbilityFactory,
    CaslProductIngredientAbilityFactory,
    CaslPhotoAbilityFactory,
    CaslService,
  ],
  exports: [
    CaslIngredientAbilityFactory,
    CaslProductAbilityFactory,
    CaslProductIngredientAbilityFactory,
    CaslPhotoAbilityFactory,
    CaslService,
  ],
})
export class CaslModule {}
