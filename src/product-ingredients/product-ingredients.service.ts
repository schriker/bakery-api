import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ProductIngredient } from './entities/product-ingredient.entity';
import { CreateProductIngredientArgs } from './gto/createProductIngredient.args';

@Injectable()
export class ProductIngredientsService {
  constructor(
    @InjectRepository(ProductIngredient)
    private ingredientRepository: Repository<ProductIngredient>,
  ) {}

  async createProductIngredient(
    args: CreateProductIngredientArgs,
    user: User,
    product: Product,
    ingredient: Ingredient,
  ): Promise<ProductIngredient> {
    const result = await this.ingredientRepository
      .createQueryBuilder()
      .insert()
      .into(ProductIngredient)
      .values({
        count: args.count,
        ingredient: ingredient,
        product: product,
        user: user,
      })
      .execute();
    return {
      ...args,
      user: user,
      ingredient: ingredient,
      product: product,
      ...result.raw[0],
    };
  }
}
