import { ForbiddenException, UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GQLSessionGuard } from 'src/auth/guards/gql-session-auth.guard';
import { CaslIngredientAbilityFactory } from 'src/casl/casl-ingredient-ability.factory';
import { CaslProductAbilityFactory } from 'src/casl/casl-product-ability.factory';
import { CaslProductIngredientAbilityFactory } from 'src/casl/casl-product-ingredient-ability.factory';
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
    private caslProductIngredientAbilityFactory: CaslProductIngredientAbilityFactory,
    private caslProductAbilityFactory: CaslProductAbilityFactory,
    private caslIngredientAbilityFactory: CaslIngredientAbilityFactory,
    private productsService: ProductsService,
    private ingredientsService: IngredientsService,
    private productIngredientsService: ProductIngredientsService,
  ) {}

  checkAbility(
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
    this.checkAbility(
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
    this.checkAbility(
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

    this.checkAbility(
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
