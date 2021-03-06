import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Int,
} from '@nestjs/graphql';
import { GQLSessionGuard } from 'src/auth/guards/gql-session-auth.guard';
import { CaslService } from 'src/casl/casl.service';
import { Action } from 'src/casl/types/casl.types';
import { CurrentUser } from 'src/users/decorators/currentUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { CreateIngredientArgs } from './dto/createIngredient.args';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientsService } from './ingredients.service';

@Resolver(() => Ingredient)
export class IngredientsResolver {
  constructor(
    private ingredeintsService: IngredientsService,
    private usersService: UsersService,
    private caslService: CaslService,
  ) {}

  @UseGuards(GQLSessionGuard)
  @Query(() => [Ingredient])
  ingredients(@CurrentUser() user: User) {
    return this.ingredeintsService.findIngredientsByUser(user);
  }

  @ResolveField(() => User)
  async user(@CurrentUser() user: User) {
    const ingredientUser = await this.usersService.findUserById(user.id);
    return ingredientUser;
  }

  @UseGuards(GQLSessionGuard)
  @Mutation(() => Ingredient)
  createIngredient(
    @Args() args: CreateIngredientArgs,
    @CurrentUser() user: User,
  ) {
    this.caslService.checkAbilityForIngredient(Action.Manage, user, Ingredient);

    return this.ingredeintsService.createIngredient(args, user);
  }

  @UseGuards(GQLSessionGuard)
  @Mutation(() => Ingredient)
  async updateIngredient(
    @Args('id', { type: () => Int }) id: number,
    @Args() args: CreateIngredientArgs,
    @CurrentUser() user: User,
  ) {
    const ingredient = await this.ingredeintsService.findIngredientById(id);

    this.caslService.checkAbilityForIngredient(Action.Manage, user, ingredient);

    return this.ingredeintsService.updateIngredient({
      ...ingredient,
      ...args,
    });
  }

  @UseGuards(GQLSessionGuard)
  @Mutation(() => Boolean)
  async deleteIngredient(
    @Args('id', { type: () => [Int] }) id: number[],
    @CurrentUser() user: User,
  ) {
    const ingredients = await this.ingredeintsService.findIngredientsById(id);

    this.caslService.checkAbilityForIngredient(
      Action.Manage,
      user,
      ingredients,
    );

    await this.ingredeintsService.deleteIngredientsById(id);

    return true;
  }
}
