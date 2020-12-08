import {
  ForbiddenException,
  forwardRef,
  Inject,
  UseGuards,
} from '@nestjs/common';
import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Int,
} from '@nestjs/graphql';
import { GQLSessionGuard } from 'src/auth/guards/gql-session-auth.guard';
import { CaslIngredientAbilityFactory } from 'src/casl/casl-ingredient-ability.factory';
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
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private caslIngredientAbilityFactory: CaslIngredientAbilityFactory,
  ) {}

  @UseGuards(GQLSessionGuard)
  @Query(() => [Ingredient])
  ingredients(@CurrentUser() user: User) {
    return this.ingredeintsService.findIngredientsByUser(user);
  }

  @ResolveField(() => User)
  async user(@CurrentUser() user: User) {
    const [ingredientUser] = await this.usersService.findUserById(user.id);
    return ingredientUser;
  }

  @UseGuards(GQLSessionGuard)
  @Mutation(() => Ingredient)
  createIngredient(
    @Args() args: CreateIngredientArgs,
    @CurrentUser() user: User,
  ) {
    const ability = this.caslIngredientAbilityFactory.createForUser(user);
    if (!ability.can(Action.Manage, Ingredient)) {
      throw new ForbiddenException();
    }
    return this.ingredeintsService.createIngredient(args, user);
  }

  @UseGuards(GQLSessionGuard)
  @Mutation(() => Boolean)
  async deleteIngredient(
    @Args('id', { type: () => [Int] }) id: number[],
    @CurrentUser() user: User,
  ) {
    const ability = this.caslIngredientAbilityFactory.createForUser(user);
    const ingredients = await this.ingredeintsService.findIngredientsById(id);

    ingredients.forEach((ingredient) => {
      if (!ability.can(Action.Manage, ingredient)) {
        throw new ForbiddenException();
      }
    });

    await this.ingredeintsService.deleteIngredientsById(id);

    return true;
  }
}
