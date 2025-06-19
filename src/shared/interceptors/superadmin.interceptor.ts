/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../../user/user.service';

@Injectable()
export class SuperAdminInterceptor implements NestInterceptor {
  constructor(private readonly userService: UserService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Not authenticated user');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const userEntity = await this.userService.findByEmail(user.email);
    const hasSuperAdminRole = userEntity
      ? userEntity.userRoles.some(
          (userRole) => userRole.role.name === 'superadmin',
        )
      : false;

    if (!userEntity || !hasSuperAdminRole) {
      throw new UnauthorizedException(
        'Access restricted to super administrators',
      );
    }

    return next.handle();
  }
}
