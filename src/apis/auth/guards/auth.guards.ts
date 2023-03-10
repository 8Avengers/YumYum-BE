import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { Observable } from 'rxjs'; //이게 뭘까?
  
  export class AuthAccessGuard extends AuthGuard('access') {
    getRequest(context: ExecutionContext) {
      return context.switchToHttp().getRequest();
    }
  }
  @Injectable()
  export class AuthRefreshGuard extends AuthGuard('refresh') {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      return super.canActivate(context);
    }
  
    handleRequest(err: any, user: any) {
      if (err || !user) {
        throw err || new UnauthorizedException();
      }
      return user;
    }
  }