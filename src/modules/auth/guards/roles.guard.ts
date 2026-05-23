import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Get the roles required for this specific route/handler
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    // 3. Get the user from the request (attached by JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // 4. Check if the user's role matches any of the required roles
    return requiredRoles.some((role) => user?.role === role);
  }
}