import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, ResolveField } from '@nestjs/graphql';
import { GQLSessionGuard } from 'src/auth/guards/gql-session-auth.guard';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { GQLPoliciesGuard } from 'src/casl/guards/gql-policies.guard';
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
  ) {}

  @UseGuards(GQLSessionGuard)
  @Query(() => [Ingredient])
  ingredients(@CurrentUser() user: User) {
    return this.ingredeintsService.findIngredients(user);
  }

  @ResolveField(() => User)
  async user(@CurrentUser() user: User) {
    const [ingredientUser] = await this.usersService.findUserById(user.id);
    return ingredientUser;
  }

  @UseGuards(GQLPoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Manage, Ingredient),
  )
  @Mutation(() => Ingredient)
  createIngredient(
    @Args() args: CreateIngredientArgs,
    @CurrentUser() user: User,
  ) {
    return this.ingredeintsService.createIngredient(args, user);
  }
}
