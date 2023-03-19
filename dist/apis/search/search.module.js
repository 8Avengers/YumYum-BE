"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchModule = void 0;
const hashtag_entity_1 = require("./../post/entities/hashtag.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const restaurant_entity_1 = require("./../restaurant/entities/restaurant.entity");
const search_controller_1 = require("./search.controller");
const search_service_1 = require("./search.service");
let SearchModule = class SearchModule {
};
SearchModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, restaurant_entity_1.Restaurant, hashtag_entity_1.Hashtag])],
        controllers: [search_controller_1.SearchController],
        providers: [search_service_1.SearchService],
    })
], SearchModule);
exports.SearchModule = SearchModule;
//# sourceMappingURL=search.module.js.map