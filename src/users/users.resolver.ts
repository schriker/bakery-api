import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GQLAuthGuard } from 'src/auth/guards/gql-local-auth.guard';
import { GQLSessionGuard } from 'src/auth/guards/gql-session-auth.guard';
import { IngredientsService } from 'src/ingredients/ingredients.service';
import { ProductsService } from 'src/products/products.service';
import { CurrentUser } from './decorators/currentUser.decorator';
import { CreateSellerArgs } from './dto/createSeller.args';
import { CreateUserArgs } from './dto/createUser.args';
import { ValidateUserArgs } from './dto/validateUser.args';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    @Inject(forwardRef(() => IngredientsService))
    private ingredientsService: IngredientsService,
    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
  ) {}

  @Mutation(() => User)
  createUser(@Args() args: CreateUserArgs) {
    return this.usersService.createUser(args);
  }

  @Mutation(() => User)
  createSeller(@Args() args: CreateSellerArgs) {
    return this.usersService.createSeller(args);
  }

  @Query(() => User)
  @UseGuards(GQLSessionGuard)
  me(@CurrentUser() user: User): User {
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    };
  }

  @Mutation(() => Boolean)
  @UseGuards(GQLAuthGuard)
  /* eslint-disable @typescript-eslint/no-unused-vars */
  login(@Args() args: ValidateUserArgs) {
    return true;
  }

  @Mutation(() => Boolean)
  logout(@Context() ctx) {
    ctx.req.logout();
    return true;
  }

  @ResolveField()
  @UseGuards(GQLSessionGuard)
  ingredients(@CurrentUser() user: User) {
    return this.ingredientsService.findIngredientsByUser(user);
  }

  @ResolveField()
  @UseGuards(GQLSessionGuard)
  products(@CurrentUser() user: User) {
    return this.productsService.findProductsByUser(user);
  }

  @ResolveField()
  @UseGuards(GQLSessionGuard)
  async city(@CurrentUser() user: User) {
    const { city } = await this.usersService.findUserById(user.id);
    return city;
  }
}
