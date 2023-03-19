import { ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
declare const AuthAccessGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class AuthAccessGuard extends AuthAccessGuard_base {
    getRequest(context: ExecutionContext): any;
}
declare const AuthRefreshGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class AuthRefreshGuard extends AuthRefreshGuard_base {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    handleRequest(err: any, user: any): any;
}
export {};
