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
exports.RestaurantController = void 0;
const update_restaurant_dto_1 = require("./dto/update-restaurant.dto");
const create_restaurant_dto_1 = require("./dto/create-restaurant.dto");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const restaurant_service_1 = require("./restaurant.service");
let RestaurantController = class RestaurantController {
    constructor(restaurantService) {
        this.restaurantService = restaurantService;
    }
    async getRestaurantDetails(kakao_place_id) {
        const restaurantDetails = await this.restaurantService.getRestaurantDetails(kakao_place_id);
        return restaurantDetails;
    }
    async createRestaurant(data) {
        return this.restaurantService.createRestaurant(data.address_name, data.category_group_code, data.category_group_name, data.category_name, data.id, data.phone, data.place_name, data.road_address_name, data.x, data.y);
    }
    async updateRestaurant(data) {
        return this.restaurantService.updateRestaurant(data.address_name, data.category_group_code, data.category_group_name, data.category_name, data.id, data.phone, data.place_name, data.road_address_name, data.x, data.y);
    }
    async deleteRestaurant(kakao_place_id) {
        return this.restaurantService.deleteRestaurant(kakao_place_id);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '가게 상세 데이터 받기' }),
    (0, common_1.Get)('/:kakao_place_id'),
    __param(0, (0, common_1.Param)('kakao_place_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantController.prototype, "getRestaurantDetails", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '가게 데이터 저장하기' }),
    (0, common_1.Post)('/createRestaurant'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_restaurant_dto_1.CreateRestaurantDto]),
    __metadata("design:returntype", Promise)
], RestaurantController.prototype, "createRestaurant", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '가게 데이터 수정하기' }),
    (0, common_1.Put)('/updateRestaurant'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_restaurant_dto_1.UpdateRestaurantDto]),
    __metadata("design:returntype", Promise)
], RestaurantController.prototype, "updateRestaurant", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '가게 데이터 지우기' }),
    (0, common_1.Delete)('/deleteRestaurant/:kakao_place_id'),
    __param(0, (0, common_1.Param)('kakao_place_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantController.prototype, "deleteRestaurant", null);
RestaurantController = __decorate([
    (0, swagger_1.ApiTags)('Restaurant'),
    (0, common_1.Controller)('restaurant'),
    __metadata("design:paramtypes", [restaurant_service_1.RestaurantService])
], RestaurantController);
exports.RestaurantController = RestaurantController;
//# sourceMappingURL=restaurant.controller.js.map