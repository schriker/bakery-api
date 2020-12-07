import { Resolver } from '@nestjs/graphql';
import { ProductIngredient } from './entities/product-ingredient.entity';

@Resolver(() => ProductIngredient)
export class ProductIngredientsResolver {}
