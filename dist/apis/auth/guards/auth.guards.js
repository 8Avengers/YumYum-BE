"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRefreshGuard = exports.AuthAccessGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
class AuthAccessGuard extends (0, passport_1.AuthGuard)('access') {
    getRequest(context) {
        return context.switchToHttp().getRequest();
    }
}
exports.AuthAccessGuard = AuthAccessGuard;
let AuthRefreshGuard = class AuthRefreshGuard extends (0, passport_1.AuthGuard)('refresh') {
    canActivate(context) {
        return super.canActivate(context);
    }
    handleRequest(err, user) {
        if (err || !user) {
            throw err || new common_1.UnauthorizedException();
        }
        return user;
    }
};
AuthRefreshGuard = __decorate([
    (0, common_1.Injectable)()
], AuthRefreshGuard);
exports.AuthRefreshGuard = AuthRefreshGuard;
//# sourceMappingURL=auth.guards.js.map