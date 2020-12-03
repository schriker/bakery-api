import { Query, Resolver } from '@nestjs/graphql';
import { User } from './user.entity';

@Resolver(() => User)
export class UsersResolver {
  @Query(() => String)
  me() {
    return 'Return current user.';
  }
}
