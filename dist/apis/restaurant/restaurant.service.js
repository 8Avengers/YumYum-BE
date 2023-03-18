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
exports.RestaurantService = void 0;
const Repository_1 = require("typeorm/repository/Repository");
const restaurant_entity_1 = require("./entities/restaurant.entity");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
let RestaurantService = class RestaurantService {
    constructor(restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }
    async getRestaurantDetails(kakao_place_id) {
        return await this.restaurantRepository.findBy({
            kakao_place_id: kakao_place_id,
        });
    }
    async createRestaurant(address_name, category_group_code, category_group_name, category_name, kakao_place_id, phone, place_name, road_address_name, x, y) {
        try {
            const restaurant = await this.getRestaurantDetails(kakao_place_id);
            if (restaurant.length > 0) {
                return restaurant[0].id;
            }
            const { identifiers } = await this.restaurantRepository.insert({
                address_name,
                category_group_code,
                category_group_name,
                category_name,
                kakao_place_id,
                phone,
                place_name,
                road_address_name,
                x,
                y,
            });
            return identifiers[0].id;
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async updateRestaurant(address_name, category_group_code, category_group_name, category_name, kakao_place_id, phone, place_name, road_address_name, x, y) {
        const restaurant = await this.getRestaurantDetails(kakao_place_id);
        if (restaurant.length < 1) {
            throw new common_1.NotFoundException('없는 가게 정보 입니다.');
        }
        return this.restaurantRepository.update({ kakao_place_id: kakao_place_id }, {
            address_name,
            category_group_code,
            category_group_name,
            category_name,
            kakao_place_id,
            phone,
            place_name,
            road_address_name,
            x,
            y,
        });
    }
    catch(err) {
        if (err instanceof common_1.NotFoundException) {
            throw err;
        }
        else {
            throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
        }
    }
    async deleteRestaurant(kakao_place_id) {
        try {
            const result = await this.restaurantRepository.softDelete({
                kakao_place_id: kakao_place_id,
            });
            if (result.affected === 0) {
                throw new common_1.NotFoundException(`Restaurant with kakao_place_id : ${kakao_place_id} not found.`);
            }
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            else {
                throw new common_1.InternalServerErrorException('Something went wrong while processing your request. Please try again later.');
            }
        }
    }
};
RestaurantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(restaurant_entity_1.Restaurant)),
    __metadata("design:paramtypes", [Repository_1.Repository])
], RestaurantService);
exports.RestaurantService = RestaurantService;
//# sourceMappingURL=restaurant.service.js.map