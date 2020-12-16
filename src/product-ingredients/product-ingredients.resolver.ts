import { UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GQLSessionGuard } from 'src/auth/guards/gql-session-auth.guard';
import { CaslService } from 'src/casl/casl.service';
import { Action } from 'src/casl/types/casl.types';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { IngredientsService } from 'src/ingredients/ingredients.service';
import { Product } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { ProductIngredient } from './entities/product-ingredient.entity';
import { CreateProductIngredientArgs } from './gto/createProductIngredient.args';
import { ProductIngredientsService } from './product-ingredients.service';

@Resolver(() => ProductIngredient)
export class ProductIngredientsResolver {
  constructor(
    private productsService: ProductsService,
    private ingredientsService: IngredientsService,
    private productIngredientsService: ProductIngredientsService,
    private caslService: CaslService,
  ) {}

  @Mutation(() => ProductIngredient)
  @UseGuards(GQLSessionGuard)
  async createProductIngredient(
    @Args() args: CreateProductIngredientArgs,
    @CurrentUser() user: User,
  ) {
    const product = await this.productsService.findProductById(args.product);
    const ingredient = await this.ingredientsService.findIngredientById(
      args.ingredient,
    );

    this.caslService.checkAbilityForProuctIngredient(
      Action.Manage,
      user,
      product,
      ingredient,
      ProductIngredient,
    );

    return this.productIngredientsService.createProductIngredient(
      args,
      user,
      product,
      ingredient,
    );
  }

  @UseGuards(GQLSessionGuard)
  @Mutation(() => ProductIngredient)
  async updateProductIngredient(
    @Args('id', { type: () => Int }) id: number,
    @Args() args: CreateProductIngredientArgs,
    @CurrentUser() user: User,
  ) {
    const product = await this.productsService.findProductById(args.product);
    const ingredient = await this.ingredientsService.findIngredientById(
      args.ingredient,
    );
    const productIngredient = await this.productIngredientsService.findProductIngredientById(
      id,
    );

    this.caslService.checkAbilityForProuctIngredient(
      Action.Manage,
      user,
      product,
      ingredient,
      productIngredient,
    );

    return this.productIngredientsService.updateProductIngredient({
      ...productIngredient,
      count: args.count,
    });
  }

  @UseGuards(GQLSessionGuard)
  @Mutation(() => Boolean)
  async deleteProductIngredient(
    @Args('id', { type: () => [Int] }) id: number[],
    @CurrentUser() user: User,
  ) {
    const productIngredeints = await this.productIngredientsService.findProductIngredientsById(
      id,
    );

    this.caslService.checkAbilityForProuctIngredient(
      Action.Manage,
      user,
      Product,
      Ingredient,
      productIngredeints,
    );

    await this.productIngredientsService.deleteProductIngredientsById(id);

    return true;
  }

  @ResolveField()
  async ingredient(@Parent() parent: ProductIngredient) {
    const result = await this.productIngredientsService.findProductIngredientById(
      parent.id,
    );
    return result.ingredient;
  }

  @ResolveField()
  async user(@Parent() parent: ProductIngredient) {
    const result = await this.productIngredientsService.findProductIngredientById(
      parent.id,
    );
    return result.user;
  }

  @ResolveField()
  async product(@Parent() parent: ProductIngredient) {
    const result = await this.productIngredientsService.findProductIngredientById(
      parent.id,
    );
    return result.product;
  }
}
