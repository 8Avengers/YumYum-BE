"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)((data, context) => {
    const req = context.switchToHttp().getRequest();
    console.log(':::::현재유저는 누구일까? req.user:::::', req.user);
    return req.user;
});
//# sourceMappingURL=current-user.decorator.js.map