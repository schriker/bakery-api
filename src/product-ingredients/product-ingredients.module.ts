import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductIngredient } from './entities/product-ingredient.entity';
import { ProductIngredientsResolver } from './product-ingredients.resolver';
import { ProductIngredientsService } from './product-ingredients.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductIngredient])],
  providers: [ProductIngredientsService, ProductIngredientsResolver],
})
export class ProductIngredientsModule {}
