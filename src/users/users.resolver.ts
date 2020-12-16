import { UseGuards } from '@nestjs/common';
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
import { MailingService } from 'src/mailing/mailing.service';
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
    private mailingService: MailingService,
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
    this.mailingService.sendVerificationEmail();
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
  email(@CurrentUser() user: User) {
    if (user) {
      return user.email;
    } else {
      return '';
    }
  }

  @ResolveField()
  lastName(@CurrentUser() user: User) {
    if (user) {
      return user.lastName;
    } else {
      return null;
    }
  }
}
