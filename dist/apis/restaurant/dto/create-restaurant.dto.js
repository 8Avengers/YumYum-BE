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
exports.CreateRestaurantDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateRestaurantDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '제주특별자치도 서귀포시 성산읍 오조리 7-2',
        description: '지번 주소',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRestaurantDto.prototype, "address_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'FD6',
        description: '카테고리 코드(카카오)',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRestaurantDto.prototype, "category_group_code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '음식점',
        description: '카테고리 그룹 이름(카카오)',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRestaurantDto.prototype, "category_group_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '음식점 > 한식 > 육류,고기',
        description: '카테고리 이름(카카오)',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRestaurantDto.prototype, "category_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1896620216',
        description: '가게 ID (카카오)',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRestaurantDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "'064-782-7330' 이거나 빈값",
        description: '가게 전화번호',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRestaurantDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '복자씨 연탄구이',
        description: '가게 이름',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRestaurantDto.prototype, "place_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '제주특별자치도 서귀포시 성산읍 한도로 124',
        description: '도로명 주소',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRestaurantDto.prototype, "road_address_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '126.921242446619',
        description: '경도',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRestaurantDto.prototype, "x", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '33.4685316070004',
        description: '위도',
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRestaurantDto.prototype, "y", void 0);
exports.CreateRestaurantDto = CreateRestaurantDto;
//# sourceMappingURL=create-restaurant.dto.js.map