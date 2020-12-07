import { ForbiddenException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GQLSessionGuard } from 'src/auth/guards/gql-session-auth.guard';
import { CaslIngredientAbilityFactory } from 'src/casl/casl-ingredient-ability.factory';
import { CaslProductAbilityFactory } from 'src/casl/casl-product-ability.factory';
import { CaslProductIngredientAbilityFactory } from 'src/casl/casl-product-ingredient-ability.factory';
import { Action } from 'src/casl/types/casl.types';
import { IngredientsService } from 'src/ingredients/ingredients.service';
import { ProductsService } from 'src/products/products.service';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { ProductIngredient } from './entities/product-ingredient.entity';
import { CreateProductIngredientArgs } from './gto/createProductIngredient.args';
import { ProductIngredientsService } from './product-ingredients.service';

@Resolver(() => ProductIngredient)
export class ProductIngredientsResolver {
  constructor(
    private castProductIngredientAbilityFactory: CaslProductIngredientAbilityFactory,
    private castProductAbilityFactory: CaslProductAbilityFactory,
    private castIngredientAbilityFactory: CaslIngredientAbilityFactory,
    private productsService: ProductsService,
    private ingredientsService: IngredientsService,
    private productIngredientsService: ProductIngredientsService,
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

    const productAbility = this.castProductAbilityFactory.createForUser(user);
    const ingredientAbility = this.castIngredientAbilityFactory.createForUser(
      user,
    );
    const productIngredientAbility = this.castProductIngredientAbilityFactory.createForUser(
      user,
    );

    if (
      !productIngredientAbility.can(Action.Manage, ProductIngredient) ||
      !productAbility.can(Action.Manage, product) ||
      !ingredientAbility.can(Action.Manage, ingredient)
    ) {
      throw new ForbiddenException();
    }

    return this.productIngredientsService.createProductIngredient(
      args,
      user,
      product,
      ingredient,
    );
  }
}
