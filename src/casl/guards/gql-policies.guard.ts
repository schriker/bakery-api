import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CaslIngredientAbilityFactory,
  AppAbility,
} from '../casl-ingredient-ability.factory';
import { PolicyHandler } from '../types/casl.types';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';

@Injectable()
export class GQLPoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslIngredientAbilityFactory: CaslIngredientAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const user = request.session.passport.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    const ability = this.caslIngredientAbilityFactory.createForUser(user);

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability),
    );
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
