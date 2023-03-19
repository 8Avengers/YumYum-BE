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
exports.UserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UserDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Email address of the user' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Password of the user' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(60),
    __metadata("design:type", String)
], UserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Nickname of the user' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserDto.prototype, "nickname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Name of the user' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Gender of the user (M or F)' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^(M|F)$/),
    __metadata("design:type", String)
], UserDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Birth date of the user in the format of YYYYMMDD',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^\d{8}$/),
    __metadata("design:type", String)
], UserDto.prototype, "birth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Phone number of the user in the format of 11 digits',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^\d{11}$/),
    __metadata("design:type", String)
], UserDto.prototype, "phone_number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Profile image of the user' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserDto.prototype, "profile_image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Introduction of the user',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserDto.prototype, "introduce", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: 'ID of the user' }),
    __metadata("design:type", Number)
], UserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: 'Number of followers of the user' }),
    __metadata("design:type", Number)
], UserDto.prototype, "followerCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: 'Number of following of the user' }),
    __metadata("design:type", Number)
], UserDto.prototype, "followingCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Creation date and time of the user',
    }),
    __metadata("design:type", String)
], UserDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Last update date and time of the user',
    }),
    __metadata("design:type", String)
], UserDto.prototype, "updated_at", void 0);
exports.UserDto = UserDto;
//# sourceMappingURL=user.dto.js.map