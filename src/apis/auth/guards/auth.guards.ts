import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthAccessGuard extends AuthGuard('access') {
  getRequest(context: ExecutionContext) {
    console.log('여기통과하나????????');
    
    return context.switchToHttp().getRequest();
    
  }
}

@Injectable()
export class AuthRefreshGuard extends AuthGuard('refresh') {
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
