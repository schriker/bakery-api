import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GQLAuthGuard } from 'src/auth/guards/gql-local-auth.guard';
import { GQLSessionGuard } from 'src/auth/guards/gql-session-auth.guard';
import { CurrentUser } from './currentUser.decorator';
import { CreateUserArgs } from './dto/createUser.args';
import { ValidateUserArgs } from './dto/validateUser.args';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args() args: CreateUserArgs) {
    const userId = await this.usersService.createUser(args);
    return {
      id: userId,
      email: args.email,
    };
  }

  @Query(() => User)
  @UseGuards(GQLSessionGuard)
  me(@CurrentUser() user: User) {
    return user;
  }

  @Mutation(() => Boolean)
  @UseGuards(GQLAuthGuard)
  /* eslint-disable @typescript-eslint/no-unused-vars */
  login(@Args() args: ValidateUserArgs) {
    return true;
  }
}
