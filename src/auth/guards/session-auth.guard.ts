import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      if (request.session.passport.user) {
        return true;
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
