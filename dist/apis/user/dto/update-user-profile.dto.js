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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateUserProfileDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '승윤123',
        description: 'nickanme',
        required: true,
    }),
    (0, class_validator_1.IsString)({ message: '닉네임은 문자열로 입력해주세요.' }),
    (0, class_validator_1.MinLength)(2, { message: '닉네임은 최소 2글자 입니다.' }),
    (0, class_validator_1.MaxLength)(10, { message: '닉네임은 최대 10글자 입니다.' }),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "nickname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '이것은 나의 소개를 입력하는 곳입니다.',
        description: '소개',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: '소개는 문자열로 입력해주세요.' }),
    (0, class_validator_1.MaxLength)(100, {
        message: '자기소개는 최대 100글자까지 입력할 수 있습니다.',
    }),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "introduce", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'profileImage',
        description: 'Profile Image',
    }),
    (0, class_validator_1.IsString)({ message: 'Profile Image must be a string.' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "profileImage", void 0);
exports.UpdateUserProfileDto = UpdateUserProfileDto;
//# sourceMappingURL=update-user-profile.dto.js.map