import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserArgs } from './dto/createUser.args';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => String)
  me() {
    return 'Return current user.';
  }

  @Mutation(() => User)
  async createUser(@Args() args: CreateUserArgs) {
    const userId = await this.usersService.createUser(args);
    return {
      id: userId,
      email: args.email,
    };
  }
}
