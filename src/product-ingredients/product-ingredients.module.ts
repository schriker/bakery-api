import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';
import { IngredientsModule } from 'src/ingredients/ingredients.module';
import { ProductsModule } from 'src/products/products.module';
import { ProductIngredient } from './entities/product-ingredient.entity';
import { ProductIngredientsResolver } from './product-ingredients.resolver';
import { ProductIngredientsService } from './product-ingredients.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductIngredient]),
    CaslModule,
    ProductsModule,
    IngredientsModule,
  ],
  providers: [ProductIngredientsService, ProductIngredientsResolver],
})
export class ProductIngredientsModule {}
