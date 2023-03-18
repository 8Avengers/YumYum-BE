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
exports.Restaurant = void 0;
const typeorm_1 = require("typeorm");
const post_entity_1 = require("../../post/entities/post.entity");
const collection_item_entity_1 = require("../../collection/entities/collection-item.entity");
let Restaurant = class Restaurant {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Restaurant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Restaurant.prototype, "address_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Restaurant.prototype, "category_group_code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Restaurant.prototype, "category_group_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Restaurant.prototype, "category_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Restaurant.prototype, "kakao_place_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Restaurant.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Restaurant.prototype, "place_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Restaurant.prototype, "road_address_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Restaurant.prototype, "x", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Restaurant.prototype, "y", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Restaurant.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Restaurant.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Restaurant.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => post_entity_1.Post, (posts) => posts.restaurant),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], Restaurant.prototype, "posts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)((type) => collection_item_entity_1.CollectionItem, (collectionItem) => collectionItem.restaurant),
    __metadata("design:type", Array)
], Restaurant.prototype, "collectionItems", void 0);
Restaurant = __decorate([
    (0, typeorm_1.Entity)()
], Restaurant);
exports.Restaurant = Restaurant;
//# sourceMappingURL=restaurant.entity.js.map