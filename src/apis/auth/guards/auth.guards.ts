import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class AuthAccessGuard extends AuthGuard('access') {
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}

export class AuthRefreshGuard extends AuthGuard('refresh') {
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
