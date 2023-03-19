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
exports.UpdateUserProfileResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateUserProfileResponseDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '최강8조',
        description: '닉네임',
    }),
    __metadata("design:type", String)
], UpdateUserProfileResponseDto.prototype, "nickname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '최강8조',
        description: '소개',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserProfileResponseDto.prototype, "introduce", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'yumyumdb/1678810993996_KakaoTalk_20230305_231238341_06.jpg',
        description: '프로필이미지',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserProfileResponseDto.prototype, "profile_image", void 0);
exports.UpdateUserProfileResponseDto = UpdateUserProfileResponseDto;
//# sourceMappingURL=update-user-response.dto.js.map