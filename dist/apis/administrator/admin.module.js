"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../user/entities/user.entity");
const restaurant_entity_1 = require("../restaurant/entities/restaurant.entity");
const post_entity_1 = require("../post/entities/post.entity");
const comment_entity_1 = require("../comment/entities/comment.entity");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
let AdminModule = class AdminModule {
};
AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, post_entity_1.Post, restaurant_entity_1.Restaurant, comment_entity_1.Comment])],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService],
    })
], AdminModule);
exports.AdminModule = AdminModule;
//# sourceMappingURL=admin.module.js.map