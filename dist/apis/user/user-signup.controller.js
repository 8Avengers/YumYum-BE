"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSignupController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const create_user_dto_1 = require("./dto/create-user.dto");
const user_signup_service_1 = require("./user-signup.service");
let UserSignupController = class UserSignupController {
    constructor(userSignupService) {
        this.userSignupService = userSignupService;
    }
    async signUp(createUserDto) {
        try {
            const { email, password, nickname, name, gender, birth, phoneNumber } = createUserDto;
            console.log(createUserDto);
            const hashedPassword = await bcrypt.hash(password, 12);
            const response = await this.userSignupService.createLocalUser({
                email,
                hashedPassword,
                nickname,
                name,
                gender,
                birth,
                phoneNumber,
            });
            return { message: '회원가입이 성공했습니다.' };
        }
        catch (error) {
            return { error: error.message };
        }
    }
};
__decorate([
    (0, common_1.Post)('/signup'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserSignupController.prototype, "signUp", null);
UserSignupController = __decorate([
    (0, swagger_1.ApiTags)('회원가입'),
    (0, common_1.Controller)('/'),
    __metadata("design:paramtypes", [user_signup_service_1.UserSignupService])
], UserSignupController);
exports.UserSignupController = UserSignupController;
//# sourceMappingURL=user-signup.controller.js.map